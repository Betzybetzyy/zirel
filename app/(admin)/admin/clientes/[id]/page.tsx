import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, AlertCircle } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getCustomerForAdmin } from "@/lib/queries"
import { ClienteForm } from "@/components/admin/cliente-form"
import { VentaStatusBadge } from "@/components/admin/venta-status-badge"
import { formatCLP } from "@/lib/utils-format"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const customer = await getCustomerForAdmin(id)
  return { title: customer ? `${customer.name} – Zirel Admin` : "Cliente – Zirel Admin" }
}

export default async function ClienteDetailPage({ params }: Props) {
  await verifyAdmin()
  const { id } = await params
  const customer = await getCustomerForAdmin(id)
  if (!customer) notFound()

  // ponytail: inline balance calc
  const salesWithBalance = customer.sales
    .map((s) => {
      const paid = s.payments.reduce((ps, p) => ps + p.amount, 0)
      return { ...s, paid, saldo: Math.max(0, s.total - paid) }
    })
    .filter((s) => s.saldo > 0)

  const deudaTotal = salesWithBalance.reduce((sum, s) => sum + s.saldo, 0)
  const totalCompras = customer.sales.reduce((sum, s) => sum + s.total, 0)

  const defaultValues = {
    name: customer.name,
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    address: customer.address ?? "",
    notes: customer.notes ?? "",
  }

  return (
    <>
      <PageMeta
        title={customer.name}
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Clientes", href: "/admin/clientes" },
          { label: customer.name },
        ]}
      />

      <div className="space-y-5">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Compras registradas", value: customer.sales.length.toString() },
            { label: "Total comprado", value: totalCompras > 0 ? formatCLP(totalCompras) : "—" },
            {
              label: "Saldo pendiente",
              value: deudaTotal > 0 ? formatCLP(deudaTotal) : "Sin deuda",
              highlight: deudaTotal > 0,
            },
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

        {/* Saldos pendientes */}
        {salesWithBalance.length > 0 && (
          <div className="rounded-xl border border-amber-300/60 bg-amber-50/40 dark:bg-amber-900/10 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-amber-300/40">
              <AlertCircle className="size-4 text-amber-600 shrink-0" />
              <h2
                className="text-sm font-semibold tracking-[0.15em] uppercase text-amber-700 dark:text-amber-500"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Pagos pendientes
              </h2>
              <span
                className="ml-auto text-[10px] tracking-widest uppercase text-amber-600 font-semibold tabular-nums"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Total: {formatCLP(deudaTotal)}
              </span>
            </div>

            <div className="divide-y divide-amber-200/40">
              <div
                className="hidden md:grid grid-cols-[80px_1fr_120px_120px_130px_24px] gap-4 px-6 py-3
                  text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-600/80"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                <span>N°</span>
                <span>Fecha</span>
                <span className="text-right">Total</span>
                <span className="text-right">Pagado</span>
                <span className="text-right">Saldo</span>
                <span />
              </div>

              {salesWithBalance.map((sale) => (
                <Link
                  key={sale.id}
                  href={`/admin/ventas/${sale.id}`}
                  className="grid md:grid-cols-[80px_1fr_120px_120px_130px_24px] gap-4 px-6 py-4 items-center
                    hover:bg-amber-100/30 transition-colors group"
                >
                  <span
                    className="text-sm font-semibold tabular-nums text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    #{sale.saleNumber}
                  </span>
                  <span
                    className="text-sm text-[var(--muted-foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    <span className="mr-2">
                      {new Date(sale.createdAt).toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <VentaStatusBadge status={sale.status} />
                  </span>
                  <span
                    className="text-sm text-right tabular-nums text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {formatCLP(sale.total)}
                  </span>
                  <span
                    className="text-sm text-right tabular-nums text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {formatCLP(sale.paid)}
                  </span>
                  <span
                    className="text-sm text-right tabular-nums font-bold text-amber-600"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {formatCLP(sale.saldo)}
                  </span>
                  <ChevronRight className="size-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Edit form */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h2
              className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Datos del cliente
            </h2>
          </div>
          <div className="p-6">
            <ClienteForm clienteId={customer.id} defaultValues={defaultValues} />
          </div>
        </div>

        {/* Sales history */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h2
              className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Historial de compras
            </h2>
          </div>

          {customer.sales.length === 0 ? (
            <p
              className="text-sm text-[var(--muted-foreground)] text-center py-10"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Sin compras registradas.
            </p>
          ) : (
            <>
              <div
                className="hidden md:grid grid-cols-[80px_1fr_120px_120px_120px_24px] gap-4 px-6 py-3
                  text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]
                  bg-[color-mix(in_srgb,var(--muted)_22%,transparent)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                <span>N°</span>
                <span>Fecha</span>
                <span className="text-right">Total</span>
                <span className="text-right">Pagado</span>
                <span className="text-right">Saldo</span>
                <span />
              </div>

              <div className="divide-y divide-[var(--border)]">
                {customer.sales.map((sale) => {
                  const paid = sale.payments.reduce((s, p) => s + p.amount, 0)
                  const saldo = Math.max(0, sale.total - paid)

                  return (
                    <Link
                      key={sale.id}
                      href={`/admin/ventas/${sale.id}`}
                      className="grid md:grid-cols-[80px_1fr_120px_120px_120px_24px] gap-4 px-6 py-4 items-center
                        hover:bg-[color-mix(in_srgb,var(--muted)_18%,transparent)] transition-colors group"
                    >
                      <span
                        className="text-sm font-semibold tabular-nums text-[var(--foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        #{sale.saleNumber}
                      </span>
                      <span
                        className="text-sm text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        <span className="mr-2">
                          {new Date(sale.createdAt).toLocaleDateString("es-CL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <VentaStatusBadge status={sale.status} />
                      </span>
                      <span
                        className="text-sm text-right tabular-nums text-[var(--foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {formatCLP(sale.total)}
                      </span>
                      <span
                        className="text-sm text-right tabular-nums text-[var(--foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {formatCLP(paid)}
                      </span>
                      <span
                        className={`text-sm text-right tabular-nums font-medium ${
                          saldo > 0 ? "text-amber-600" : "text-[var(--muted-foreground)]"
                        }`}
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {saldo > 0 ? formatCLP(saldo) : "—"}
                      </span>
                      <ChevronRight className="size-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
