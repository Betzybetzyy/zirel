"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { annulSale } from "@/app/actions/ventas"
import { useAdminUIStore } from "@/lib/admin-ui-store"

interface VentaAnularDialogProps {
  id: string
  saleNumber: number
}

export function VentaAnularDialog({ id, saleNumber }: VentaAnularDialogProps) {
  const adminTheme = useAdminUIStore((s) => s.theme)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleAnnul() {
    startTransition(async () => {
      const result = await annulSale(id)
      if (!result.success) {
        sileo.error({
          title: "Error al anular",
          description: result.error ?? "No se pudo anular la venta.",
        })
        setOpen(false)
        return
      }
      sileo.success({
        title: "Venta anulada",
        description: `La venta #${saleNumber} fue anulada y el stock fue restaurado.`,
      })
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 text-[10px] tracking-widest uppercase border-[var(--border)] text-[var(--muted-foreground)] hover:text-destructive hover:border-destructive/40"
      >
        <XCircle className="size-3.5" />
        Anular venta
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
              Anular venta #{saleNumber}
            </DialogTitle>
          </div>

          <div className="px-5 py-5">
            <p
              className="text-sm text-[var(--foreground)] leading-relaxed"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              ¿Seguro que quieres anular la venta{" "}
              <span className="font-semibold">#{saleNumber}</span>? El stock de
              todos los productos será restaurado automáticamente. Esta acción no
              se puede deshacer.
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
              onClick={handleAnnul}
              disabled={isPending}
            >
              {isPending ? "Anulando..." : "Anular venta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
