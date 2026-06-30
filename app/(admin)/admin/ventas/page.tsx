import Link from "next/link"
import { Plus, Receipt, ChevronRight } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getSalesForAdmin, type SalesFilters } from "@/lib/queries"
import { VentaFilters } from "@/components/admin/venta-filters"
import { VentaStatusBadge } from "@/components/admin/venta-status-badge"
import { Button } from "@/components/ui/button"
import { formatCLP } from "@/lib/utils-format"
import type { SaleStatus, PaymentMethod } from "@prisma/client"

export const metadata = { title: "Ventas – Zirel Admin" }

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  CUOTAS: "Cuotas",
  ABONO: "Abono",
}

interface Props {
  searchParams: Promise<{
    from?: string
    to?: string
    status?: string
    paymentMethod?: string
  }>
}

export default async function VentasPage({ searchParams }: Props) {
  await verifyAdmin()
  const params = await searchParams

  const VALID_STATUSES = new Set<string>(["PENDIENTE", "COMPLETADA", "ANULADA"])
  const VALID_METHODS = new Set<string>(["EFECTIVO", "TRANSFERENCIA", "CUOTAS", "ABONO"])

  const filters: SalesFilters = {
    from: params.from,
    to: params.to,
    status: VALID_STATUSES.has(params.status ?? "") ? (params.status as SaleStatus) : undefined,
    paymentMethod: VALID_METHODS.has(params.paymentMethod ?? "")
      ? (params.paymentMethod as PaymentMethod)
      : undefined,
  }

  const sales = await getSalesForAdmin(filters)

  const totalFiltered = sales
    .filter((s) => s.status === "COMPLETADA")
    .reduce((sum, s) => sum + s.total, 0)

  return (
    <>
      <PageMeta
        title="Ventas"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ventas" },
        ]}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--border)]">
          <div>
            <h2
              className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Registro de ventas
            </h2>
            <p
              className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {sales.length} venta{sales.length !== 1 ? "s" : ""}
              {sales.length > 0 && (
                <span className="ml-2 text-[var(--zirel-cafe-topo)]">
                  · completadas: {formatCLP(totalFiltered)}
                </span>
              )}
            </p>
          </div>
          <Link href="/admin/ventas/nueva">
            <Button className="gap-2 flex-shrink-0 bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold">
              <Plus className="size-4" />
              Nueva venta
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <VentaFilters />

        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt
              className="size-10 mb-3 opacity-30"
              style={{ color: "var(--muted-foreground)" }}
            />
            <p
              className="text-sm text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              No hay ventas registradas para estos filtros.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {/* Cabecera de columnas */}
            <div
              className="hidden md:grid grid-cols-[80px_1fr_1fr_1fr_120px_auto] gap-4 px-6 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] bg-[color-mix(in_srgb,var(--muted)_22%,transparent)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <span>N°</span>
              <span>Fecha</span>
              <span>Cliente</span>
              <span>Método</span>
              <span>Total</span>
              <span className="w-24 text-right">Estado</span>
            </div>

            {sales.map((sale) => (
              <Link
                key={sale.id}
                href={`/admin/ventas/${sale.id}`}
                className="grid md:grid-cols-[80px_1fr_1fr_1fr_120px_auto] gap-4 px-6 py-4 items-center hover:bg-[color-mix(in_srgb,var(--muted)_18%,transparent)] transition-colors group"
              >
                {/* N° */}
                <span className="font-mono text-sm font-medium text-[var(--zirel-dorado-beige)] group-hover:underline underline-offset-2">
                  #{sale.saleNumber}
                </span>

                {/* Fecha */}
                <p
                  className="text-sm text-[var(--muted-foreground)]"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {sale.createdAt.toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Cliente */}
                <p
                  className="text-sm text-[var(--foreground)] truncate"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {sale.customerName || (
                    <span className="text-[var(--muted-foreground)] italic">Sin nombre</span>
                  )}
                </p>

                {/* Método */}
                <p
                  className="text-sm text-[var(--muted-foreground)] hidden md:block"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {PAYMENT_LABEL[sale.paymentMethod]}
                </p>

                {/* Total */}
                <p
                  className="text-sm font-medium text-[var(--foreground)] hidden md:block"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {formatCLP(sale.total)}
                </p>

                {/* Estado */}
                <div className="flex items-center justify-end gap-2 w-24">
                  <VentaStatusBadge status={sale.status} />
                  <ChevronRight className="size-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
