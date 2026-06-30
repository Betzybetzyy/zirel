import { z } from "zod"
import { msg } from "./messages"

export const categoriaSchema = z.object({
  name: z.string().min(1, msg.required).max(80, msg.max(80)),
  description: z.string().max(300, msg.max(300)).optional().or(z.literal("")),
  order: z.coerce.number<number>().int(msg.number.integer).min(0, msg.number.min(0)),
})

export type CategoriaInput = z.infer<typeof categoriaSchema>
