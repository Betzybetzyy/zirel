import { notFound } from "next/navigation"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getCategories, getProductForAdmin } from "@/lib/queries"
import { ProductoForm } from "@/components/admin/producto-form"

export const metadata = { title: "Editar producto – Zirel Admin" }

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await verifyAdmin()
  const { id } = await params

  const [product, categories] = await Promise.all([
    getProductForAdmin(id),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <>
      <PageMeta
        title={`Editar: ${product.name}`}
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Productos", href: "/admin/productos" },
          { label: product.name },
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
          <p
            className="mt-1 text-xs text-[var(--muted-foreground)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            SKU: {product.sku}
          </p>
        </div>
        <div className="p-6">
          <ProductoForm
            categories={categories}
            productId={id}
            defaultValues={{
              name: product.name,
              sku: product.sku,
              description: product.description ?? undefined,
              price: product.price,
              stock: product.stock,
              size: product.size ?? undefined,
              material: product.material,
              categoryId: product.categoryId,
              active: product.active,
              featured: product.featured,
            }}
            defaultImageUrl={
              product.images.find((i) => i.isPrimary)?.url ??
              product.images[0]?.url
            }
          />
        </div>
      </div>
    </>
  )
}
