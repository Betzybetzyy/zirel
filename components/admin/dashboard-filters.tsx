"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { CalendarDays, X } from "lucide-react"

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

const PRESETS = [
  {
    id: "esta-semana",
    label: "Esta semana",
    getRange: () => {
      const now = new Date()
      const day = now.getDay() === 0 ? 7 : now.getDay()
      const start = new Date(now)
      start.setDate(now.getDate() - day + 1)
      return { from: toDateStr(start), to: toDateStr(now) }
    },
  },
  {
    id: "este-mes",
    label: "Este mes",
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { from: toDateStr(start), to: toDateStr(end) }
    },
  },
  {
    id: "mes-pasado",
    label: "Mes pasado",
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: toDateStr(start), to: toDateStr(end) }
    },
  },
  {
    id: "tres-meses",
    label: "Últimos 3 meses",
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { from: toDateStr(start), to: toDateStr(end) }
    },
  },
]

function getActivePreset(from: string, to: string): string | null {
  // No params = server defaults to current month
  if (!from && !to) return "este-mes"
  for (const p of PRESETS) {
    const r = p.getRange()
    if (r.from === from && r.to === to) return p.id
  }
  return null
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function DashboardFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showCustom, setShowCustom] = useState(false)

  const from = searchParams.get("from") ?? ""
  const to = searchParams.get("to") ?? ""

  const activePreset = getActivePreset(from, to)
  const isCustomActive = activePreset === null
  const showInputs = showCustom || isCustomActive

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v)
        else params.delete(k)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  function applyPreset(id: string) {
    setShowCustom(false)
    const preset = PRESETS.find((p) => p.id === id)
    if (!preset) return
    setParams(preset.getRange())
  }

  // Compute period label from effective range
  const defaultRange = PRESETS[1].getRange()
  const periodLabel = `${formatDate(from || defaultRange.from)} – ${formatDate(to || defaultRange.to)}`

  return (
    <div
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm mb-4"
      style={{ fontFamily: "var(--font-nunito)" }}
    >
      {/* Preset pills row */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <CalendarDays className="size-3.5 text-[var(--zirel-cafe-topo)] shrink-0 mr-1" />

        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.id && !showCustom
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                isActive
                  ? "bg-[var(--zirel-cafe-topo)] text-[var(--zirel-marfil)] border-transparent"
                  : "bg-transparent text-[var(--zirel-cafe-topo)] border-[var(--zirel-arena)] hover:bg-[var(--zirel-beige-suave)]"
              }`}
            >
              {preset.label}
            </button>
          )
        })}

        {/* Personalizado pill */}
        <button
          onClick={() => setShowCustom(true)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer border ${
            showCustom || isCustomActive
              ? "bg-[var(--zirel-cafe-topo)] text-[var(--zirel-marfil)] border-transparent"
              : "bg-transparent text-[var(--zirel-cafe-topo)] border-[var(--zirel-arena)] hover:bg-[var(--zirel-beige-suave)]"
          }`}
        >
          Personalizado
        </button>

        {/* Period label — always visible so user knows what they're viewing */}
        <span
          className="ml-auto text-[11px] shrink-0"
          style={{ color: "var(--zirel-cafe-topo)", opacity: 0.65 }}
        >
          {periodLabel}
        </span>
      </div>

      {/* Custom date inputs — only shown when personalizado is active */}
      {showInputs && (
        <div
          className="flex flex-wrap items-center gap-3 px-4 pb-3 pt-2.5 border-t"
          style={{ borderColor: "var(--zirel-arena)" }}
        >
          <div className="flex items-center gap-2">
            <label
              className="text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap"
              style={{ color: "var(--muted-foreground)" }}
            >
              Desde
            </label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setParams({ from: e.target.value })}
              className="h-8 w-[140px] text-xs"
              style={{
                borderColor: "var(--zirel-arena)",
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              className="text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap"
              style={{ color: "var(--muted-foreground)" }}
            >
              Hasta
            </label>
            <Input
              type="date"
              value={to}
              onChange={(e) => setParams({ to: e.target.value })}
              className="h-8 w-[140px] text-xs"
              style={{
                borderColor: "var(--zirel-arena)",
              }}
            />
          </div>

          <button
            onClick={() => {
              setShowCustom(false)
              setParams({ from: "", to: "" })
            }}
            className="flex items-center gap-1 text-[11px] transition-colors cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="size-3" />
            Limpiar
          </button>
        </div>
      )}
    </div>
  )
}
