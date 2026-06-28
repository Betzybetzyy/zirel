import { z } from "zod"
import { msg } from "./messages"

export const clienteSchema = z.object({
  name: z.string().min(1, msg.required).max(100, msg.max(100)),
  phone: z.string().max(30, msg.max(30)).optional().or(z.literal("")),
  email: z.string().email(msg.email).max(120, msg.max(120)).optional().or(z.literal("")),
  address: z.string().max(200, msg.max(200)).optional().or(z.literal("")),
  notes: z.string().max(500, msg.max(500)).optional().or(z.literal("")),
})

export type ClienteInput = z.infer<typeof clienteSchema>
