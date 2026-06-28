import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getCustomersForAdmin } from "@/lib/queries"
import { ClienteDeleteDialog } from "@/components/admin/cliente-delete-dialog"
import { Button } from "@/components/ui/button"
import { formatCLP } from "@/lib/utils-format"

export const metadata = { title: "Clientes – Zirel Admin" }

export default async function ClientesPage() {
  await verifyAdmin()
  const customers = await getCustomersForAdmin()

  // ponytail: scan O(n) en JS; agregar DB aggregation si crece
  const { withDeuda, stats } = customers.reduce(
    (acc, c) => {
      const deuda = c.sales.reduce((sum, s) => {
        const paid = s.payments.reduce((ps, p) => ps + p.amount, 0)
        return sum + Math.max(0, s.total - paid)
      }, 0)
      acc.withDeuda.push({ ...c, deuda })
      acc.stats.totalDeuda += deuda
      if (deuda > 0) acc.stats.conDeuda++
      return acc
    },
    { withDeuda: [] as (typeof customers[number] & { deuda: number })[], stats: { totalDeuda: 0, conDeuda: 0 } }
  )

  return (
    <>
      <PageMeta
        title="Clientes"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Clientes" },
        ]}
      />

      <div className="space-y-4">
        {/* Stats strip */}
        {withDeuda.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total clientes", value: withDeuda.length.toString() },
              { label: "Con saldo pendiente", value: stats.conDeuda.toString(), highlight: stats.conDeuda > 0 },
              { label: "Deuda total", value: stats.totalDeuda > 0 ? formatCLP(stats.totalDeuda) : "—", highlight: stats.totalDeuda > 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-sm"
              >
                <p
                  className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-1"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {stat.label}
                </p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    stat.highlight ? "text-amber-600" : "text-[var(--foreground)]"
                  }`}
                  style={{ fontFamily: "var(--font-baskerville)" }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[var(--border)]">
            <div>
              <h2
                className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Clientes
              </h2>
              <p
                className="mt-0.5 text-xs text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {withDeuda.length} {withDeuda.length === 1 ? "cliente" : "clientes"} registrados
              </p>
            </div>
            <Button
              asChild
              className="bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold text-[10px] tracking-widest uppercase"
            >
              <Link href="/admin/clientes/nuevo">
                <Plus className="size-3.5 mr-1.5" />
                Nuevo cliente
              </Link>
            </Button>
          </div>

          {withDeuda.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
              <Users className="size-10 text-[var(--muted-foreground)]/30" strokeWidth={1} />
              <p
                className="text-sm text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Aún no hay clientes registrados.
              </p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div
                className="hidden md:grid grid-cols-[1fr_140px_80px_140px_40px] gap-4 px-6 py-3
                  text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]
                  bg-[color-mix(in_srgb,var(--muted)_22%,transparent)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                <span>Nombre</span>
                <span>Teléfono</span>
                <span className="text-right">Ventas</span>
                <span className="text-right">Saldo pendiente</span>
                <span />
              </div>

              <div className="divide-y divide-[var(--border)]">
                {withDeuda.map((c) => (
                    <div
                      key={c.id}
                      className="grid md:grid-cols-[1fr_140px_80px_140px_40px] gap-4 px-6 py-4 items-center
                        hover:bg-[color-mix(in_srgb,var(--muted)_18%,transparent)] transition-colors"
                    >
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="font-medium text-sm text-[var(--foreground)] hover:underline underline-offset-4"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {c.name}
                      </Link>
                      <span
                        className="text-sm text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {c.phone ?? "—"}
                      </span>
                      <span
                        className="text-sm text-right text-[var(--muted-foreground)] tabular-nums"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {c.sales.length}
                      </span>
                      <span
                        className={`text-sm text-right tabular-nums font-medium ${
                          c.deuda > 0 ? "text-amber-600" : "text-[var(--muted-foreground)]"
                        }`}
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {c.deuda > 0 ? formatCLP(c.deuda) : "—"}
                      </span>
                      <ClienteDeleteDialog id={c.id} name={c.name} />
                    </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
