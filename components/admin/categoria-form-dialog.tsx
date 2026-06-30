"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Plus } from "lucide-react"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/form/TextField"
import { categoriaSchema, type CategoriaInput } from "@/lib/schemas/categoria"
import { createCategoria, updateCategoria } from "@/app/actions/categorias"
import { useAdminUIStore } from "@/lib/admin-ui-store"

interface Props {
  mode: "create" | "edit"
  categoryId?: string
  defaultValues?: Partial<CategoriaInput>
}

export function CategoriaFormDialog({ mode, categoryId, defaultValues }: Props) {
  const adminTheme = useAdminUIStore((s) => s.theme)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isEdit = mode === "edit"

  const form = useForm<CategoriaInput>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      order: defaultValues?.order ?? 0,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = isEdit
      ? await updateCategoria(categoryId!, data)
      : await createCategoria(data)

    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }

    sileo.success({
      title: isEdit ? "Categoría actualizada" : "Categoría creada",
      description: isEdit
        ? "Los cambios fueron guardados correctamente."
        : "La categoría fue creada correctamente.",
    })

    setOpen(false)
    form.reset()
    router.refresh()
  })

  return (
    <>
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="size-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        >
          <Pencil className="size-3.5" />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold text-[10px] tracking-widest uppercase"
        >
          <Plus className="size-3.5 mr-1.5" />
          Nueva categoría
        </Button>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset() }}>
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
              {isEdit ? "Editar categoría" : "Nueva categoría"}
            </DialogTitle>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="px-5 py-5 space-y-4">
              <TextField name="name" label="Nombre" required />
              <TextField name="description" label="Descripción" multiline placeholder="Opcional…" />
              <TextField name="order" label="Orden" type="number" placeholder="0" />

              {form.formState.errors.root && (
                <p className="text-sm text-destructive" style={{ fontFamily: "var(--font-nunito)" }}>
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="flex gap-3 pt-2">
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
                  className="flex-1 bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? isEdit ? "Guardando…" : "Creando…"
                    : isEdit ? "Guardar" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
