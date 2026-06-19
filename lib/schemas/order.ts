import { z } from "zod"
import { msg } from "./messages"

// Schema para los campos del cliente en el checkout (sin items)
export const customerSchema = z.object({
  customerName: z
    .string()
    .min(2, msg.min(2))
    .max(100, msg.max(100)),
  customerEmail: z.email({ error: msg.email }),
  customerPhone: z
    .string()
    .min(8, msg.phone)
    .max(20, msg.max(20)),
  customerAddress: z.string().max(200, msg.max(200)).optional(),
  customerComuna: z.string().max(100, msg.max(100)).optional(),
  customerNotes: z.string().max(500, msg.max(500)).optional(),
})

export type CustomerInput = z.infer<typeof customerSchema>

// Schema completo de orden incluyendo items (usado en el server action)
export const orderSchema = customerSchema.extend({
  items: z
    .array(
      z.object({
        productId: z.string(),
        sku: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1).max(99),
      })
    )
    .min(1, "El carrito está vacío"),
})

export type CreateOrderInput = z.infer<typeof orderSchema>
