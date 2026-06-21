import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Package } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getAllProductsForAdmin } from "@/lib/queries"
import { ProductoDeleteDialog } from "@/components/admin/producto-delete-dialog"
import { Button } from "@/components/ui/button"
import { formatCLP } from "@/lib/utils-format"

export const metadata = { title: "Productos – Zirel Admin" }

export default async function ProductosPage() {
  await verifyAdmin()
  const products = await getAllProductsForAdmin()

  return (
    <>
      <PageMeta
        title="Productos"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Productos" },
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
              Catálogo
            </h2>
            <p
              className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {products.length} producto{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/admin/productos/nuevo">
            <Button className="gap-2 flex-shrink-0 bg-[#C7A87E] text-[#1e1a17] hover:bg-[#DABF9D] border-0 font-semibold">
              <Plus className="size-4" />
              Nuevo producto
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package
              className="size-10 mb-3 opacity-30"
              style={{ color: "var(--muted-foreground)" }}
            />
            <p
              className="text-sm text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Aún no hay productos. Crea el primero.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {/* Column headers */}
            <div
              className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <span>Producto</span>
              <span>Categoría</span>
              <span>Precio</span>
              <span>Stock</span>
              <span className="w-20 text-right">Acciones</span>
            </div>

            {products.map((product) => {
              const primaryImage = product.images[0]
              const isActive = product.active

              return (
                <div
                  key={product.id}
                  className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center"
                >
                  {/* Image + Name + SKU + badges */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="size-10 shrink-0 rounded-lg overflow-hidden"
                      style={{ background: "var(--zirel-beige-suave)" }}
                    >
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt ?? product.name}
                          width={40}
                          height={40}
                          className="size-full object-contain"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <Package
                            className="size-4 opacity-30"
                            style={{ color: "var(--muted-foreground)" }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium text-[var(--foreground)] truncate"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                          {product.sku}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.15em] uppercase"
                          style={{
                            background: isActive
                              ? "color-mix(in srgb, #C7A87E 18%, transparent)"
                              : "color-mix(in srgb, var(--muted-foreground) 12%, transparent)",
                            color: isActive ? "#C7A87E" : "var(--muted-foreground)",
                          }}
                        >
                          <span
                            className="inline-block w-1 h-1 rounded-full"
                            style={{
                              background: isActive ? "#C7A87E" : "var(--muted-foreground)",
                            }}
                          />
                          {isActive ? "Activo" : "Inactivo"}
                        </span>
                        {product.featured && (
                          <span
                            className="text-[9px] font-semibold tracking-[0.15em] uppercase px-1.5 py-0.5"
                            style={{
                              background:
                                "color-mix(in srgb, var(--zirel-dorado-beige) 15%, transparent)",
                              color: "var(--zirel-dorado-beige)",
                            }}
                          >
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <p
                    className="text-sm text-[var(--muted-foreground)] hidden md:block"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {product.category.name}
                  </p>

                  {/* Price */}
                  <p
                    className="text-sm font-medium text-[var(--foreground)] hidden md:block"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {formatCLP(product.price)}
                  </p>

                  {/* Stock */}
                  <p
                    className="text-sm text-[var(--foreground)] hidden md:block"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {product.stock}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end w-20">
                    <Link href={`/admin/productos/${product.id}/editar`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </Link>
                    <ProductoDeleteDialog id={product.id} name={product.name} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
