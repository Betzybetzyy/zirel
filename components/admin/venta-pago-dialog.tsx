"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Banknote, CreditCard, CheckCircle2 } from "lucide-react"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { registrarPagoSchema, type RegistrarPagoInput } from "@/lib/schemas/venta"
import { registerSalePayment } from "@/app/actions/ventas"
import { formatCLP } from "@/lib/utils-format"
import { useAdminUIStore } from "@/lib/admin-ui-store"
import type { PaymentMethod } from "@prisma/client"

interface VentaPagoDialogProps {
  saleId: string
  saleNumber: number
  saleTotal: number
  paidAmount: number
  paymentMethod: PaymentMethod
  installmentCount: number | null
  installmentsPaid: number
}

const METHOD_OPTIONS = [
  { value: "EFECTIVO", label: "Efectivo", icon: Banknote },
  { value: "TRANSFERENCIA", label: "Transferencia", icon: CreditCard },
] as const

export function VentaPagoDialog({
  saleId,
  saleNumber,
  saleTotal,
  paidAmount,
  paymentMethod,
  installmentCount,
  installmentsPaid,
}: VentaPagoDialogProps) {
  const adminTheme = useAdminUIStore((s) => s.theme)
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const balance = saleTotal - paidAmount
  const isCuotas = paymentMethod === "CUOTAS"
  const cuotasPendientes = isCuotas && installmentCount ? installmentCount - installmentsPaid : null
  const sugestedAmount = isCuotas && cuotasPendientes
    ? Math.ceil(balance / cuotasPendientes)
    : balance

  const form = useForm<RegistrarPagoInput>({
    resolver: zodResolver(registrarPagoSchema),
    defaultValues: {
      amount: sugestedAmount,
      method: "EFECTIVO",
      note: "",
    },
  })

  const watchedAmount = Number(form.watch("amount")) || 0
  const watchedMethod = form.watch("method")
  const newBalance = balance - watchedAmount

  function handleOpen() {
    form.reset({
      amount: sugestedAmount,
      method: "EFECTIVO",
      note: "",
    })
    setOpen(true)
  }

  function onSubmit(data: RegistrarPagoInput) {
    startTransition(async () => {
      const result = await registerSalePayment(saleId, data)
      if (!result.success) {
        form.setError("root", { message: result.error })
        return
      }
      sileo.success({
        title: newBalance <= 0 ? "¡Venta saldada!" : "Pago registrado",
        description:
          newBalance <= 0
            ? `Venta #${saleNumber} completamente pagada.`
            : `Pago de ${formatCLP(data.amount)} registrado. Saldo restante: ${formatCLP(Math.max(0, newBalance))}.`,
      })
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <Button
        size="sm"
        onClick={handleOpen}
        className="gap-1.5 text-[10px] tracking-widest uppercase bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold"
      >
        <PlusCircle className="size-3.5" />
        {isCuotas ? `Registrar cuota ${installmentsPaid + 1}` : "Registrar abono"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-admin-theme={adminTheme}
          className="max-w-sm rounded-2xl overflow-hidden p-0"
        >
          <div
            className="px-5 py-4 border-b border-[var(--border)]"
            style={{
              background:
                adminTheme === "dark"
                  ? "var(--secondary)"
                  : "color-mix(in srgb, var(--zirel-marfil) 50%, white)",
            }}
          >
            <DialogTitle
              className="text-sm font-semibold tracking-widest uppercase text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {isCuotas
                ? `Cuota ${installmentsPaid + 1}${installmentCount ? ` de ${installmentCount}` : ""} — #${saleNumber}`
                : `Registrar abono — #${saleNumber}`}
            </DialogTitle>
            <p
              className="mt-1 text-xs text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Saldo pendiente: <span className="font-semibold text-amber-500">{formatCLP(balance)}</span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="px-5 py-5 space-y-5">

                {/* Monto */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field: f, fieldState }) => (
                    <FormItem className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Monto a pagar (CLP)
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={balance}
                          {...f}
                          className={`h-10 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)] ${fieldState.error ? "border-destructive" : ""}`}
                          style={{ fontFamily: "var(--font-nunito)" }}
                        />
                      </FormControl>
                      <FormMessage />
                      {watchedAmount > 0 && (
                        <p
                          className={`text-xs tabular-nums ${newBalance <= 0 ? "text-emerald-500" : "text-amber-500"}`}
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          {newBalance <= 0
                            ? "Venta saldada completamente"
                            : `Saldo restante: ${formatCLP(Math.max(0, newBalance))}`}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Método */}
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field: f }) => (
                    <FormItem className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Método de pago
                      </label>
                      <FormControl>
                        <div className="flex gap-2">
                          {METHOD_OPTIONS.map(({ value, label, icon: Icon }) => {
                            const active = watchedMethod === value
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => f.onChange(value)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-medium transition-all
                                  ${
                                    active
                                      ? "border-[var(--zirel-dorado-beige)] bg-[color-mix(in_srgb,var(--zirel-dorado-beige)_12%,transparent)] text-[var(--zirel-dorado-beige)]"
                                      : "border-[var(--zirel-arena)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]"
                                  }`}
                                style={{ fontFamily: "var(--font-nunito)" }}
                              >
                                <Icon className="size-3.5 shrink-0" />
                                {label}
                                {active && <CheckCircle2 className="size-3 shrink-0 ml-0.5" />}
                              </button>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nota */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field: f }) => (
                    <FormItem className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Nota (opcional)
                      </label>
                      <FormControl>
                        <Input
                          {...f}
                          placeholder="Ej: Pagó con transferencia el 20 junio"
                          className="h-10 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)]"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 px-5 pb-5">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex-1 bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold"
                >
                  {form.formState.isSubmitting ? "Guardando…" : "Registrar pago"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
