import { z } from "zod"
import { msg } from "./messages"

export const loginSchema = z.object({
  email: z.email({ error: msg.email }),
  password: z.string().min(1, msg.required),
  next: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
