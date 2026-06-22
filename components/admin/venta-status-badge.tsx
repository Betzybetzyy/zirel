import type { SaleStatus } from "@prisma/client"

interface VentaStatusBadgeProps {
  status: SaleStatus
}

const STATUS_CONFIG: Record<
  SaleStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  COMPLETADA: {
    label: "Completada",
    bg: "color-mix(in srgb, #C7A87E 18%, transparent)",
    color: "#C7A87E",
    dot: "#C7A87E",
  },
  ANULADA: {
    label: "Anulada",
    bg: "color-mix(in srgb, #B85A5A 12%, transparent)",
    color: "#B85A5A",
    dot: "#B85A5A",
  },
  PENDIENTE: {
    label: "Pendiente",
    bg: "color-mix(in srgb, var(--zirel-arena) 30%, transparent)",
    color: "var(--zirel-cafe-topo)",
    dot: "var(--zirel-arena)",
  },
}

export function VentaStatusBadge({ status }: VentaStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.15em] uppercase"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className="inline-block w-1 h-1 rounded-full"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}
