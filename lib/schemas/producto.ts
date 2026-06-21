import { z } from "zod"
import { msg } from "./messages"

export const productoSchema = z.object({
  name: z.string().min(2, msg.min(2)).max(100, msg.max(100)),
  sku: z.string().min(2, msg.min(2)).max(20, msg.max(20)),
  description: z.string().max(500, msg.max(500)).optional(),
  price: z.coerce.number<number>().int(msg.number.integer).min(1, msg.number.positive),
  stock: z.coerce.number<number>().int(msg.number.integer).min(0, msg.number.min(0)),
  size: z.string().max(50, msg.max(50)).optional(),
  material: z.string().min(1, msg.required).max(100, msg.max(100)),
  categoryId: z.string().min(1, msg.required),
  active: z.boolean(),
  featured: z.boolean(),
})

export type ProductoInput = z.infer<typeof productoSchema>
