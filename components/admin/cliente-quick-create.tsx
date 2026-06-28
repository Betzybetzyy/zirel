"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"
import { sileo } from "sileo"
import { z } from "zod"
import { clienteSchema } from "@/lib/schemas/cliente"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/form/TextField"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { createCliente } from "@/app/actions/clientes"
import { useAdminUIStore } from "@/lib/admin-ui-store"

// ponytail: solo nombre + teléfono; resto se completa en el perfil del cliente
const quickSchema = clienteSchema.pick({ name: true, phone: true })
type QuickInput = z.infer<typeof quickSchema>

interface ClienteQuickCreateProps {
  onCreated: (customer: { id: string; name: string; phone: string | null }) => void
}

export function ClienteQuickCreate({ onCreated }: ClienteQuickCreateProps) {
  const adminTheme = useAdminUIStore((s) => s.theme)
  const [open, setOpen] = useState(false)

  const form = useForm<QuickInput>({
    resolver: zodResolver(quickSchema),
    defaultValues: { name: "", phone: "" },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await createCliente(data)
    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }
    sileo.success({ title: "Cliente creado", description: `"${result.customer.name}" fue registrado.` })
    onCreated(result.customer)
    form.reset()
    setOpen(false)
  })

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 gap-1.5 text-[10px] tracking-widest uppercase shrink-0"
      >
        <UserPlus className="size-3.5" />
        Nuevo
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
              Nuevo cliente
            </DialogTitle>
          </div>

          <div className="px-5 py-5">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <TextField name="name" label="Nombre" required />
                <TextField name="phone" label="Teléfono" placeholder="Ej: +56 9 1234 5678" />

                {form.formState.errors.root && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setOpen(false); form.reset() }}
                    disabled={form.formState.isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex-1 bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold"
                  >
                    {form.formState.isSubmitting ? "Creando..." : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
