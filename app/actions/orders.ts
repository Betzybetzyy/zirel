"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validación con Zod
const orderSchema = z.object({
  customerName: z.string().min(2, "Nombre muy corto"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(8, "Teléfono inválido"),
  customerAddress: z.string().optional(),
  customerComuna: z.string().optional(),
  customerNotes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        sku: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
      })
    )
    .min(1, "El carrito está vacío"),
});

export type CreateOrderInput = z.infer<typeof orderSchema>;

export async function createOrder(input: CreateOrderInput) {
  try {
    // Validar
    const data = orderSchema.parse(input);

    // Calcular totales (en el servidor, NO confiamos en el cliente)
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Crear pedido + items en una sola transacción
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerComuna: data.customerComuna,
        customerNotes: data.customerNotes,
        subtotal,
        total: subtotal, // Por ahora sin costos de envío
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productSku: item.sku,
            productName: item.name,
            productPrice: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return { success: true as const, order };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        error: error.issues[0]?.message || "Datos inválidos",
      };
    }
    console.error("Error creando pedido:", error);
    return {
      success: false as const,
      error: "Error al crear el pedido. Inténtalo de nuevo.",
    };
  }
}