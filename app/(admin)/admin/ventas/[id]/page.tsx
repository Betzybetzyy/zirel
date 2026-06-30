import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getSaleForAdmin } from "@/lib/queries"
import { VentaStatusBadge } from "@/components/admin/venta-status-badge"
import { VentaAnularDialog } from "@/components/admin/venta-anular-dialog"
import { VentaPagoDialog } from "@/components/admin/venta-pago-dialog"
import { Button } from "@/components/ui/button"
import { formatCLP } from "@/lib/utils-format"
import type { PaymentMethod } from "@prisma/client"

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  CUOTAS: "Cuotas",
  ABONO: "Abono",
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const sale = await getSaleForAdmin(id)
  if (!sale) return { title: "Venta no encontrada – Zirel Admin" }
  return { title: `Venta #${sale.saleNumber} – Zirel Admin` }
}

export default async function VentaDetallePage({ params }: Props) {
  await verifyAdmin()
  const { id } = await params
  const sale = await getSaleForAdmin(id)
  if (!sale) notFound()

  const isCreditSale = sale.paymentMethod === "CUOTAS" || sale.paymentMethod === "ABONO"
  const paidAmount = sale.payments.reduce((s, p) => s + p.amount, 0)
  const balance = sale.total - paidAmount
  const installmentsPaid = sale.payments.length

  return (
    <>
      <PageMeta
        title={`Venta #${sale.saleNumber}`}
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ventas", href: "/admin/ventas" },
          { label: `#${sale.saleNumber}` },
        ]}
      />

      <div className="space-y-6">
        {/* Cabecera */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="px-6 py-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2
                  className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Venta #{sale.saleNumber}
                </h2>
                <VentaStatusBadge status={sale.status} />
              </div>
              <p
                className="text-xs text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {sale.createdAt.toLocaleDateString("es-CL", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {sale.status === "PENDIENTE" && (
                <VentaAnularDialog id={sale.id} saleNumber={sale.saleNumber} />
              )}
              {isCreditSale && sale.status === "PENDIENTE" && (
                <VentaPagoDialog
                  saleId={sale.id}
                  saleNumber={sale.saleNumber}
                  saleTotal={sale.total}
                  paidAmount={paidAmount}
                  paymentMethod={sale.paymentMethod}
                  installmentCount={sale.installmentCount}
                  installmentsPaid={installmentsPaid}
                />
              )}
              <Link href="/admin/ventas">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <ArrowLeft className="size-3.5" />
                  Volver
                </Button>
              </Link>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-6 pb-5 grid sm:grid-cols-3 gap-4">
            <div>
              <p
                className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-1"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Método de pago
              </p>
              <p
                className="text-sm text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {PAYMENT_LABEL[sale.paymentMethod]}
                {sale.paymentMethod === "CUOTAS" && sale.installmentCount && (
                  <span className="text-[var(--muted-foreground)] ml-1.5">
                    · {sale.installmentCount} cuotas
                  </span>
                )}
              </p>
            </div>

            <div>
              <p
                className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-1"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Cliente
              </p>
              <p
                className="text-sm text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {sale.customerName || (
                  <span className="italic text-[var(--muted-foreground)]">Sin nombre</span>
                )}
              </p>
            </div>

            {sale.customerNotes && (
              <div>
                <p
                  className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-1"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Notas
                </p>
                <p
                  className="text-sm text-[var(--foreground)] leading-relaxed"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {sale.customerNotes}
                </p>
              </div>
            )}

            {sale.annulledAt && (
              <div>
                <p
                  className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-1"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Anulada el
                </p>
                <p
                  className="text-sm text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {sale.annulledAt.toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h3
              className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Productos
            </h3>
          </div>

          <div className="divide-y divide-[var(--border)]">
            <div
              className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 px-6 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <span>Producto</span>
              <span>Cant.</span>
              <span>P. unitario</span>
              <span className="text-right">Subtotal</span>
            </div>

            {sale.items.map((item) => (
              <div
                key={item.id}
                className="grid md:grid-cols-[1fr_80px_120px_120px] gap-4 px-6 py-4 items-center"
              >
                <div>
                  <p
                    className="text-sm font-medium text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {item.productName}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)] font-mono mt-0.5">
                    {item.productSku}
                  </p>
                </div>
                <p
                  className="text-sm text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {item.quantity}
                </p>
                <p
                  className="text-sm text-[var(--muted-foreground)] hidden md:block"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {formatCLP(item.productPrice)}
                </p>
                <p
                  className="text-sm font-medium text-[var(--foreground)] hidden md:block text-right"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {formatCLP(item.productPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total row */}
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-end gap-6">
            <span
              className="text-[10px] tracking-[0.18em] uppercase text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Total
            </span>
            <span
              className="text-2xl font-bold text-[var(--zirel-negro-suave)]"
              style={{ fontFamily: "var(--font-baskerville)" }}
            >
              {formatCLP(sale.total)}
            </span>
          </div>
        </div>

        {/* Pagos — solo ventas a crédito */}
        {isCreditSale && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
              <h3
                className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Pagos registrados
              </h3>

              {/* Resumen rápido */}
              <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "var(--font-nunito)" }}>
                {sale.paymentMethod === "CUOTAS" && sale.installmentCount && (
                  <span className="text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--foreground)]">{installmentsPaid}</span>
                    {" de "}
                    <span className="font-semibold text-[var(--foreground)]">{sale.installmentCount}</span>
                    {" cuotas · "}
                    {sale.installmentCount - installmentsPaid > 0 ? (
                      <span className="text-amber-500 font-semibold">
                        queda{sale.installmentCount - installmentsPaid > 1 ? "n" : ""}{" "}
                        {sale.installmentCount - installmentsPaid} pendiente
                        {sale.installmentCount - installmentsPaid > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">todas pagadas</span>
                    )}
                  </span>
                )}
                <span className="text-[var(--muted-foreground)]">
                  Pagado:{" "}
                  <span className="font-semibold text-[var(--foreground)]">{formatCLP(paidAmount)}</span>
                </span>
                {balance > 0 && (
                  <span className="text-amber-500 font-semibold">
                    Saldo: {formatCLP(balance)}
                  </span>
                )}
                {balance <= 0 && (
                  <span className="text-emerald-500 font-semibold">Saldado</span>
                )}
              </div>
            </div>

            {sale.payments.length === 0 ? (
              <div
                className="px-6 py-8 text-center text-sm text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Sin pagos registrados aún.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                <div
                  className="hidden md:grid grid-cols-[120px_1fr_100px_80px_auto] gap-4 px-6 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  <span>Fecha</span>
                  <span>Nota</span>
                  <span>Método</span>
                  {sale.paymentMethod === "CUOTAS" && <span>Cuota</span>}
                  <span className="text-right">Monto</span>
                </div>

                {sale.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="grid md:grid-cols-[120px_1fr_100px_80px_auto] gap-4 px-6 py-3 items-center"
                  >
                    <p
                      className="text-xs text-[var(--muted-foreground)] tabular-nums"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {payment.createdAt.toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p
                      className="text-sm text-[var(--foreground)] truncate"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {payment.note || (
                        <span className="italic text-[var(--muted-foreground)]">—</span>
                      )}
                    </p>
                    <p
                      className="text-xs text-[var(--muted-foreground)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {payment.method === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                    </p>
                    {sale.paymentMethod === "CUOTAS" && (
                      <p
                        className="text-xs font-mono text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {payment.installmentNumber
                          ? `#${payment.installmentNumber}`
                          : "—"}
                      </p>
                    )}
                    <p
                      className="text-sm font-semibold text-[var(--foreground)] text-right tabular-nums"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {formatCLP(payment.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Totales de pagos */}
            <div className="px-6 py-4 border-t border-[var(--border)] grid sm:grid-cols-3 gap-4">
              <div>
                <p
                  className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-0.5"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Total venta
                </p>
                <p
                  className="text-lg font-bold text-[var(--zirel-negro-suave)] tabular-nums"
                  style={{ fontFamily: "var(--font-baskerville)" }}
                >
                  {formatCLP(sale.total)}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-0.5"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Total pagado
                </p>
                <p
                  className="text-lg font-bold text-[var(--zirel-negro-suave)] tabular-nums"
                  style={{ fontFamily: "var(--font-baskerville)" }}
                >
                  {formatCLP(paidAmount)}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] mb-0.5"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Saldo pendiente
                </p>
                <p
                  className={`text-lg font-bold tabular-nums ${
                    balance <= 0
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                  style={{ fontFamily: "var(--font-baskerville)" }}
                >
                  {balance <= 0 ? "Saldado" : formatCLP(balance)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
