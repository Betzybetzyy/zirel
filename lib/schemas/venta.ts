import { z } from "zod"
import { msg } from "./messages"

export const ventaItemSchema = z.object({
  productId: z.string().min(1, msg.required),
  quantity: z.coerce.number<number>().int(msg.number.integer).min(1, msg.number.min(1)),
})

export const ventaSchema = z
  .object({
    customerName: z.string().max(100, msg.max(100)).optional(),
    customerNotes: z.string().max(500, msg.max(500)).optional(),
    paymentMethod: z.enum(["EFECTIVO", "TRANSFERENCIA", "CUOTAS", "ABONO"], {
      error: "Selecciona un método de pago",
    }),
    installmentCount: z.coerce
      .number<number>()
      .int(msg.number.integer)
      .min(2, msg.number.min(2))
      .max(60, msg.max(60))
      .optional(),
    initialPayment: z.coerce
      .number<number>()
      .int(msg.number.integer)
      .min(0, msg.number.min(0))
      .optional(),
    items: z.array(ventaItemSchema).min(1, "Agrega al menos un producto"),
  })
  .refine(
    (d) => d.paymentMethod !== "CUOTAS" || (d.installmentCount != null && d.installmentCount >= 2),
    { message: "Indica el número de cuotas (mínimo 2)", path: ["installmentCount"] }
  )

export const registrarPagoSchema = z.object({
  amount: z.coerce.number<number>().int(msg.number.integer).min(1, msg.number.min(1)),
  method: z.enum(["EFECTIVO", "TRANSFERENCIA"], { error: "Selecciona un método de pago" }),
  note: z.string().max(200, msg.max(200)).optional(),
})

export type VentaInput = z.infer<typeof ventaSchema>
export type VentaItemInput = z.infer<typeof ventaItemSchema>
export type RegistrarPagoInput = z.infer<typeof registrarPagoSchema>
