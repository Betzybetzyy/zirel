import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getProductsForSale } from "@/lib/queries"
import { VentaForm } from "@/components/admin/venta-form"

export const metadata = { title: "Nueva venta – Zirel Admin" }

export default async function NuevaVentaPage() {
  await verifyAdmin()
  const products = await getProductsForSale()

  return (
    <>
      <PageMeta
        title="Nueva venta"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ventas", href: "/admin/ventas" },
          { label: "Nueva venta" },
        ]}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h2
            className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Registrar venta
          </h2>
          <p
            className="mt-1 text-xs text-[var(--muted-foreground)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            El stock se descontará automáticamente al confirmar.
          </p>
        </div>
        <div className="p-6">
          {products.length === 0 ? (
            <p
              className="text-sm text-[var(--muted-foreground)] text-center py-8"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              No hay productos activos disponibles para vender.
            </p>
          ) : (
            <VentaForm products={products} />
          )}
        </div>
      </div>
    </>
  )
}
