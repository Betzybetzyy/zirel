import { Suspense } from "react"
import Link from "next/link"
import { TrendingUp, ShoppingBag, Clock } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getDashboardData } from "@/lib/queries"
import { DashboardFilters } from "@/components/admin/dashboard-filters"
import { SalesChart } from "@/components/admin/sales-chart"
import { formatCLP } from "@/lib/utils-format"

export const metadata = { title: "Dashboard – Zirel Admin" }

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  await verifyAdmin()
  const params = await searchParams

  const now = new Date()
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const from = params.from
    ? new Date(`${params.from}T00:00:00-04:00`)
    : defaultFrom
  const to = params.to
    ? new Date(`${params.to}T23:59:59.999-04:00`)
    : defaultTo

  const { periodSales, pendingSales } = await getDashboardData(from, to)

  const completed = periodSales.filter((s) => s.status === "COMPLETADA")
  const totalIncome = completed.reduce((sum, s) => sum + s.total, 0)
  const salesCount = completed.length
  const pendingCount = periodSales.filter((s) => s.status === "PENDIENTE").length

  const dailyMap = new Map<string, number>()
  for (const s of completed) {
    const day = s.createdAt.toISOString().slice(0, 10)
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + s.total)
  }
  const dailyData = Array.from(dailyMap, ([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const seen = new Set<string>()
  const recentItems = completed
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .flatMap((s) => s.items.map((item) => ({ ...item, date: s.createdAt })))
    .filter((item) => !seen.has(item.productSku) && !!seen.add(item.productSku))
    .slice(0, 5)

  const pendingWithBalance = pendingSales
    .map((s) => ({
      id: s.id,
      saleNumber: s.saleNumber,
      customerName: s.customerName,
      total: s.total,
      balance: s.total - s.payments.reduce((sum, p) => sum + p.amount, 0),
    }))
    .filter((s) => s.balance > 0)
    .sort((a, b) => b.balance - a.balance)

  const totalPending = pendingWithBalance.reduce((sum, s) => sum + s.balance, 0)

  return (
    <>
      <PageMeta
        title="Dashboard"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <Suspense>
        <DashboardFilters />
      </Suspense>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Ingresos del período"
          value={formatCLP(totalIncome)}
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label="Ventas completadas"
          value={String(salesCount)}
          icon={<ShoppingBag className="size-4" />}
        />
        <StatCard
          label="Saldo pendiente"
          value={formatCLP(totalPending)}
          icon={<Clock className="size-4" />}
          valueColor={totalPending > 0 ? "#B85A5A" : undefined}
          sub={pendingCount > 0 ? `${pendingCount} venta${pendingCount !== 1 ? "s" : ""} pendiente` : undefined}
        />
      </div>

      {/* Gráfico ingresos diarios */}
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)] mb-4"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Ingresos diarios
        </p>
        <SalesChart data={dailyData} />
      </div>

      {/* Productos recientes + Saldos */}
      <div className="grid gap-4 lg:grid-cols-2 mt-4">

        {/* Últimos productos vendidos */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)] mb-4"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Últimos productos vendidos
          </p>
          {recentItems.length === 0 ? (
            <p
              className="text-sm text-[var(--muted-foreground)] py-8 text-center"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Sin ventas en el período
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {recentItems.map((item, i) => (
                <div key={item.productSku} className="flex items-center gap-3 py-2.5">
                  <span
                    className="text-xs font-mono w-5 text-center shrink-0"
                    style={{ color: "var(--zirel-dorado-beige)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-[var(--foreground)] truncate"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {item.productName}
                    </p>
                    <p
                      className="text-[11px] text-[var(--muted-foreground)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {item.productSku} · {item.quantity} ud. · {formatCLP(item.productPrice)}
                    </p>
                  </div>
                  <p
                    className="text-[11px] text-[var(--muted-foreground)] shrink-0"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {item.date.toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saldos pendientes */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Saldos pendientes
            </p>
            {pendingWithBalance.length > 0 && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded"
                style={{
                  background: "color-mix(in srgb, #B85A5A 12%, transparent)",
                  color: "#B85A5A",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                {pendingWithBalance.length} deudor{pendingWithBalance.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>

          {pendingWithBalance.length === 0 ? (
            <p
              className="text-sm text-[var(--muted-foreground)] py-8 text-center"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Sin saldos pendientes
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {pendingWithBalance.slice(0, 8).map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/ventas/${s.id}`}
                  className="flex items-center gap-3 py-2.5 hover:opacity-70 transition-opacity"
                >
                  <span
                    className="font-mono text-xs shrink-0"
                    style={{ color: "var(--zirel-dorado-beige)" }}
                  >
                    #{s.saleNumber}
                  </span>
                  <p
                    className="flex-1 text-sm text-[var(--foreground)] truncate"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {s.customerName ?? (
                      <span className="italic text-[var(--muted-foreground)]">
                        Sin nombre
                      </span>
                    )}
                  </p>
                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#B85A5A", fontFamily: "var(--font-nunito)" }}
                    >
                      {formatCLP(s.balance)}
                    </p>
                    <p
                      className="text-[10px] text-[var(--muted-foreground)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      de {formatCLP(s.total)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  icon,
  valueColor,
  sub,
}: {
  label: string
  value: string
  icon: React.ReactNode
  valueColor?: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {label}
        </p>
        <span style={{ color: "var(--zirel-dorado-beige)" }}>{icon}</span>
      </div>
      <p
        className="text-2xl font-bold"
        style={{
          fontFamily: "var(--font-baskerville)",
          color: valueColor ?? "var(--zirel-negro-suave)",
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-[11px] text-[var(--muted-foreground)] mt-0.5"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
