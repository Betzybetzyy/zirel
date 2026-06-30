"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sileo } from "sileo"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/form/TextField"
import { Button } from "@/components/ui/button"
import { clienteSchema, type ClienteInput } from "@/lib/schemas/cliente"
import { createCliente, updateCliente } from "@/app/actions/clientes"

interface ClienteFormProps {
  clienteId?: string
  defaultValues?: Partial<ClienteInput>
}

export function ClienteForm({ clienteId, defaultValues }: ClienteFormProps) {
  const router = useRouter()
  const isEdit = !!clienteId

  const form = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      ...defaultValues,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = isEdit
      ? await updateCliente(clienteId, data)
      : await createCliente(data)

    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }

    sileo.success({
      title: isEdit ? "Cliente actualizado" : "Cliente creado",
      description: isEdit
        ? "Los cambios fueron guardados correctamente."
        : "El cliente fue registrado correctamente.",
    })

    if (!isEdit) form.reset()
    router.push("/admin/clientes")
    router.refresh()
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="space-y-5">
          <TextField name="name" label="Nombre" required />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField name="phone" label="Teléfono" placeholder="Ej: +56 9 1234 5678" />
            <TextField name="email" label="Email" type="email" placeholder="Ej: maria@ejemplo.com" />
          </div>
          <TextField name="address" label="Dirección" placeholder="Ej: Av. Principal 123, Santiago" />
          <TextField name="notes" label="Notas" multiline placeholder="Información adicional del cliente…" />
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          {form.formState.errors.root && (
            <p className="text-sm text-destructive mb-4">
              {form.formState.errors.root.message}
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/admin/clientes")}
              disabled={form.formState.isSubmitting}
              className="text-foreground/60 hover:text-foreground text-[10px] tracking-widest uppercase"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold text-[10px] tracking-widest uppercase px-6 transition-colors"
            >
              {form.formState.isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear cliente"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
