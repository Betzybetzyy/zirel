"use server"

import { revalidatePath } from "next/cache"
import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import {
  ventaSchema,
  registrarPagoSchema,
  type VentaInput,
  type RegistrarPagoInput,
} from "@/lib/schemas/venta"

export async function createSale(data: VentaInput) {
  await verifyAdmin()

  const parsed = ventaSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos" }
  }

  const { items, paymentMethod, customerName, customerNotes, installmentCount, initialPayment } =
    parsed.data

  try {
    const sale = await prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.productId)
      if (new Set(productIds).size !== productIds.length) {
        throw new Error("No puedes agregar el mismo producto dos veces")
      }
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds }, active: true },
        select: { id: true, price: true, sku: true, name: true, stock: true },
      })

      if (dbProducts.length !== productIds.length) {
        throw new Error("Uno o más productos no existen o están inactivos")
      }

      const productMap = new Map(dbProducts.map((p) => [p.id, p]))

      for (const item of items) {
        const product = productMap.get(item.productId)!
        // Atomic: only decrements if stock is still sufficient at write time,
        // preventing oversell under concurrent sales (READ COMMITTED race).
        const { count } = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        })
        if (count === 0) {
          const fresh = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true },
          })
          throw new Error(
            `Stock insuficiente para "${product.name}" (disponible: ${fresh?.stock ?? 0})`
          )
        }
        // Read own write within tx — deactivate if now depleted
        const postUpdate = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })
        if ((postUpdate?.stock ?? 1) <= 0) {
          await tx.product.update({ where: { id: item.productId }, data: { active: false } })
        }
      }

      const subtotal = items.reduce((sum, item) => {
        return sum + productMap.get(item.productId)!.price * item.quantity
      }, 0)

      const isCreditSale = paymentMethod === "CUOTAS" || paymentMethod === "ABONO"
      const initPaid = isCreditSale ? (initialPayment ?? 0) : subtotal

      if (isCreditSale && initialPayment != null && initialPayment > subtotal) {
        throw new Error("El abono inicial no puede superar el total de la venta")
      }

      const saleStatus = isCreditSale && initPaid < subtotal ? "PENDIENTE" : "COMPLETADA"

      const created = await tx.sale.create({
        data: {
          customerName: customerName || null,
          customerNotes: customerNotes || null,
          subtotal,
          total: subtotal,
          paymentMethod,
          status: saleStatus,
          installmentCount: paymentMethod === "CUOTAS" ? (installmentCount ?? null) : null,
          items: {
            create: items.map((item) => {
              const p = productMap.get(item.productId)!
              return {
                productId: item.productId,
                productSku: p.sku,
                productName: p.name,
                productPrice: p.price,
                quantity: item.quantity,
              }
            }),
          },
        },
        include: { items: true },
      })

      if (isCreditSale && initPaid > 0) {
        await tx.salePayment.create({
          data: {
            saleId: created.id,
            amount: initPaid,
            method: "EFECTIVO",
            installmentNumber: paymentMethod === "CUOTAS" ? 1 : null,
            note: "Abono inicial",
          },
        })
      }

      return created
    })

    revalidatePath("/admin/ventas")
    revalidatePath("/admin/productos")
    revalidatePath("/")
    return { success: true as const, sale }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al registrar la venta"
    return { success: false as const, error: msg }
  }
}

export async function registerSalePayment(saleId: string, data: RegistrarPagoInput) {
  await verifyAdmin()

  const parsed = registrarPagoSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos" }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { payments: true },
      })

      if (!sale) throw new Error("Venta no encontrada")
      if (sale.status === "ANULADA") throw new Error("La venta está anulada")
      if (sale.status === "COMPLETADA") throw new Error("La venta ya está completada")

      const paid = sale.payments.reduce((s, p) => s + p.amount, 0)
      const balance = sale.total - paid

      if (parsed.data.amount > balance) {
        throw new Error(
          `El monto supera el saldo pendiente (${balance.toLocaleString("es-CL")} CLP)`
        )
      }

      const installmentNumber =
        sale.paymentMethod === "CUOTAS" ? sale.payments.length + 1 : null

      await tx.salePayment.create({
        data: {
          saleId,
          amount: parsed.data.amount,
          method: parsed.data.method,
          installmentNumber,
          note: parsed.data.note || null,
        },
      })

      const newBalance = balance - parsed.data.amount
      if (newBalance <= 0) {
        await tx.sale.update({ where: { id: saleId }, data: { status: "COMPLETADA" } })
      }
    })

    revalidatePath(`/admin/ventas/${saleId}`)
    revalidatePath("/admin/ventas")
    return { success: true as const }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al registrar el pago"
    return { success: false as const, error: msg }
  }
}

export async function deleteSalePayment(paymentId: number, saleId: string) {
  await verifyAdmin()

  try {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.salePayment.findUnique({ where: { id: paymentId } })
      if (!payment) throw new Error("Pago no encontrado")

      await tx.salePayment.delete({ where: { id: paymentId } })

      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { payments: true },
      })
      if (!sale) throw new Error("Venta no encontrada")

      const paid = sale.payments.reduce((s, p) => s + p.amount, 0)
      if (paid < sale.total && sale.status === "COMPLETADA") {
        await tx.sale.update({ where: { id: saleId }, data: { status: "PENDIENTE" } })
      }
    })

    revalidatePath(`/admin/ventas/${saleId}`)
    revalidatePath("/admin/ventas")
    return { success: true as const }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al eliminar el pago"
    return { success: false as const, error: msg }
  }
}

export async function annulSale(id: string) {
  await verifyAdmin()

  try {
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
        include: { items: true },
      })

      if (!sale) throw new Error("Venta no encontrada")
      if (sale.status === "ANULADA") throw new Error("La venta ya está anulada")

      for (const item of sale.items) {
        const current = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, active: true },
        })
        // Product may have been hard-deleted after the sale (no FK constraint on SaleItem.productId)
        if (!current) continue
        const newStock = current.stock + item.quantity
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            ...(newStock > 0 && !current.active ? { active: true } : {}),
          },
        })
      }

      await tx.sale.update({
        where: { id },
        data: { status: "ANULADA", annulledAt: new Date() },
      })
    })

    revalidatePath("/admin/ventas")
    revalidatePath("/admin/productos")
    revalidatePath("/")
    return { success: true as const }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al anular la venta"
    return { success: false as const, error: msg }
  }
}

export async function deleteSale(id: string) {
  await verifyAdmin()

  try {
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({ where: { id }, select: { status: true } })
      if (!sale) throw new Error("Venta no encontrada")
      // Only ANULADA sales can be deleted — PENDIENTE would leak stock,
      // COMPLETADA would lose the revenue record without restoring stock.
      if (sale.status !== "ANULADA") throw new Error("Anula la venta antes de eliminarla")
      await tx.sale.delete({ where: { id } })
    })

    revalidatePath("/admin/ventas")
    return { success: true as const }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al eliminar la venta"
    return { success: false as const, error: msg }
  }
}
