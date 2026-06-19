"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { orderSchema, type CreateOrderInput } from "@/lib/schemas/order";

export type { CreateOrderInput };

export async function createOrder(input: CreateOrderInput) {
  try {
    const data = orderSchema.parse(input);

    // Verificar productos contra BD: existencia, estado activo y precios reales
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      select: { id: true, price: true, sku: true, name: true },
    });

    if (dbProducts.length !== productIds.length) {
      return {
        success: false as const,
        error: "Uno o más productos ya no están disponibles",
      };
    }

    const priceMap = new Map(dbProducts.map((p) => [p.id, p.price]));

    // Calcular subtotal con precios de BD, nunca del cliente
    const subtotal = data.items.reduce((sum, item) => {
      return sum + priceMap.get(item.productId)! * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerComuna: data.customerComuna,
        customerNotes: data.customerNotes,
        subtotal,
        total: subtotal,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productSku: item.sku,
            productName: item.name,
            productPrice: priceMap.get(item.productId)!,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return { success: true as const, order };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        error: error.issues[0]?.message || "Datos inválidos",
      };
    }
    console.error("[createOrder]", error instanceof Error ? error.message : error);
    return {
      success: false as const,
      error: "Error al crear el pedido. Inténtalo de nuevo.",
    };
  }
}