import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getCategories } from "@/lib/queries"
import { ProductoForm } from "@/components/admin/producto-form"

export const metadata = { title: "Nuevo producto – Zirel Admin" }

export default async function NuevoProductoPage() {
  await verifyAdmin()
  const categories = await getCategories()

  return (
    <>
      <PageMeta
        title="Nuevo producto"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Productos", href: "/admin/productos" },
          { label: "Nuevo" },
        ]}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h2
            className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Información del producto
          </h2>
        </div>
        <div className="p-6">
          <ProductoForm categories={categories} />
        </div>
      </div>
    </>
  )
}
