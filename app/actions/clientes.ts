"use server"

import { revalidatePath } from "next/cache"
import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { clienteSchema, type ClienteInput } from "@/lib/schemas/cliente"

function toCustomerData(d: ClienteInput) {
  return {
    name: d.name,
    phone: d.phone || null,
    email: d.email || null,
    address: d.address || null,
    notes: d.notes || null,
  }
}

export async function createCliente(data: ClienteInput) {
  await verifyAdmin()
  const parsed = clienteSchema.safeParse(data)
  if (!parsed.success) return { success: false as const, error: "Datos inválidos" }
  try {
    const customer = await prisma.customer.create({ data: toCustomerData(parsed.data) })
    revalidatePath("/admin/clientes")
    return { success: true as const, customer }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al crear el cliente"
    return { success: false as const, error: msg }
  }
}

export async function updateCliente(id: string, data: ClienteInput) {
  await verifyAdmin()
  const parsed = clienteSchema.safeParse(data)
  if (!parsed.success) return { success: false as const, error: "Datos inválidos" }
  try {
    const customer = await prisma.customer.update({ where: { id }, data: toCustomerData(parsed.data) })
    revalidatePath("/admin/clientes")
    return { success: true as const, customer }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al actualizar el cliente"
    return { success: false as const, error: msg }
  }
}

export async function deleteCliente(id: string) {
  await verifyAdmin()
  try {
    const salesCount = await prisma.sale.count({ where: { customerId: id } })
    if (salesCount > 0) {
      return {
        success: false as const,
        error: "El cliente tiene ventas registradas y no puede eliminarse",
      }
    }
    await prisma.customer.delete({ where: { id } })
    revalidatePath("/admin/clientes")
    return { success: true as const }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al eliminar el cliente"
    return { success: false as const, error: msg }
  }
}
