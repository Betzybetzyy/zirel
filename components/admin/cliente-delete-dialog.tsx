"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { deleteCliente } from "@/app/actions/clientes"
import { useAdminUIStore } from "@/lib/admin-ui-store"

interface ClienteDeleteDialogProps {
  id: string
  name: string
}

export function ClienteDeleteDialog({ id, name }: ClienteDeleteDialogProps) {
  const adminTheme = useAdminUIStore((s) => s.theme)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCliente(id)
      if (!result.success) {
        sileo.error({
          title: "Error al eliminar",
          description: result.error ?? "No se pudo eliminar el cliente.",
        })
        setOpen(false)
        return
      }
      sileo.success({
        title: "Cliente eliminado",
        description: `"${name}" fue eliminado correctamente.`,
      })
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="size-8 text-[var(--muted-foreground)] hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-3.5" />
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
              Eliminar cliente
            </DialogTitle>
          </div>

          <div className="px-5 py-5">
            <p
              className="text-sm text-[var(--foreground)] leading-relaxed"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              ¿Seguro que quieres eliminar a{" "}
              <span className="font-semibold">&ldquo;{name}&rdquo;</span>? Esta
              acción no se puede deshacer.
            </p>
          </div>

          <div className="flex gap-3 px-5 pb-5">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0 font-semibold"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
