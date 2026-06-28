"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatCLP } from "@/lib/utils-format"

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-nunito)" }}>
        Sin ventas en el período
      </div>
    )
  }

  const formatted = data.map((d) => ({
    label: new Date(d.date + "T12:00:00").toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    }),
    total: d.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--zirel-arena)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "var(--zirel-cafe-topo)", fontFamily: "var(--font-nunito)" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--zirel-cafe-topo)", fontFamily: "var(--font-nunito)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
          }
          width={52}
        />
        <Tooltip
          formatter={(value) => [formatCLP(Number(value)), "Ingresos"]}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--zirel-arena)",
            borderRadius: "0.375rem",
            fontSize: "12px",
            fontFamily: "var(--font-nunito)",
            color: "var(--foreground)",
          }}
          labelStyle={{ fontWeight: 600, color: "var(--foreground)" }}
          cursor={{ fill: "color-mix(in srgb, var(--zirel-dorado-beige) 10%, transparent)" }}
        />
        <Bar
          dataKey="total"
          fill="var(--zirel-dorado-beige)"
          radius={[3, 3, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
