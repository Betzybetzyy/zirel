import { z } from "zod"
import { msg } from "./messages"

export const flagKeySchema = z
  .string()
  .min(2, msg.min(2))
  .max(50, msg.max(50))
  .regex(
    /^[a-z][a-z0-9_-]*$/,
    msg.regex("Solo minúsculas, números, guion o guion bajo.")
  )

export const createFeatureFlagSchema = z.object({
  key: flagKeySchema,
  label: z.string().min(2, msg.min(2)).max(80, msg.max(80)),
  description: z.string().max(200, msg.max(200)).optional(),
})

export type CreateFeatureFlagInput = z.infer<typeof createFeatureFlagSchema>
