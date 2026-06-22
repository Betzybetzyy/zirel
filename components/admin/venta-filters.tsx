"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, SlidersHorizontal } from "lucide-react"

export function VentaFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const from = searchParams.get("from") ?? ""
  const to = searchParams.get("to") ?? ""
  const status = searchParams.get("status") ?? ""
  const paymentMethod = searchParams.get("paymentMethod") ?? ""

  const hasFilters = from || to || status || paymentMethod

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div
      className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--muted)_22%,transparent)]"
      style={{ fontFamily: "var(--font-nunito)" }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-8 py-3">
        {/* Section label */}
        <div className="flex items-center gap-1.5 pr-4 mr-1 border-r border-[var(--border)]">
          <SlidersHorizontal className="size-3 text-[var(--zirel-cafe-topo)]" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)] whitespace-nowrap">
            Filtrar por
          </span>
        </div>

        {/* Desde */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--muted-foreground)] whitespace-nowrap">
            Desde
          </label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setParam("from", e.target.value)}
            className="h-8 w-[130px] pl-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)] text-xs"
          />
        </div>

        {/* Hasta */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--muted-foreground)] whitespace-nowrap">
            Hasta
          </label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setParam("to", e.target.value)}
            className="h-8 w-[130px] pl-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)] text-xs"
          />
        </div>

        {/* Separador visual */}
        <div className="h-4 w-px bg-[var(--border)] mx-1" />

        {/* Estado */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--muted-foreground)] whitespace-nowrap">
            Estado
          </label>
          <Select
            value={status || "__all__"}
            onValueChange={(v) => setParam("status", v === "__all__" ? "" : v)}
          >
            <SelectTrigger className="!h-8 w-[130px] pl-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)] text-xs">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos</SelectItem>
              <SelectItem value="COMPLETADA">Completada</SelectItem>
              <SelectItem value="ANULADA">Anulada</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Método de pago */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--muted-foreground)] whitespace-nowrap">
            Pago
          </label>
          <Select
            value={paymentMethod || "__all__"}
            onValueChange={(v) =>
              setParam("paymentMethod", v === "__all__" ? "" : v)
            }
          >
            <SelectTrigger className="!h-8 w-[130px] pl-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)] text-xs">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos</SelectItem>
              <SelectItem value="EFECTIVO">Efectivo</SelectItem>
              <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
              <SelectItem value="CUOTAS">Cuotas</SelectItem>
              <SelectItem value="ABONO">Abono</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Limpiar */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="!h-8 gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-[var(--muted-foreground)] hover:text-[var(--foreground)] ml-1"
          >
            <X className="size-3" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
