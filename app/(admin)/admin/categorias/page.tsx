import { FolderTree } from "lucide-react"
import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { getCategoriesForAdmin } from "@/lib/queries"
import { CategoriaFormDialog } from "@/components/admin/categoria-form-dialog"
import { CategoriaDeleteDialog } from "@/components/admin/categoria-delete-dialog"

export const metadata = { title: "Categorías – Zirel Admin" }

export default async function CategoriasPage() {
  await verifyAdmin()
  const categories = await getCategoriesForAdmin()

  return (
    <>
      <PageMeta
        title="Categorías"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categorías" },
        ]}
      />

      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[var(--border)]">
            <div>
              <h2
                className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Categorías
              </h2>
              <p
                className="mt-0.5 text-xs text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
              </p>
            </div>
            <CategoriaFormDialog mode="create" />
          </div>

          {categories.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
              <FolderTree className="size-10 text-[var(--muted-foreground)]/30" strokeWidth={1} />
              <p
                className="text-sm text-[var(--muted-foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Aún no hay categorías. Crea la primera.
              </p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div
                className="hidden md:grid grid-cols-[1fr_2fr_80px_80px_72px] gap-4 px-6 py-3
                  text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]
                  bg-[color-mix(in_srgb,var(--muted)_22%,transparent)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                <span>Nombre</span>
                <span>Descripción</span>
                <span className="text-center">Orden</span>
                <span className="text-right">Productos</span>
                <span />
              </div>

              <div className="divide-y divide-[var(--border)]">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="grid md:grid-cols-[1fr_2fr_80px_80px_72px] gap-4 px-6 py-4 items-center
                      hover:bg-[color-mix(in_srgb,var(--muted)_18%,transparent)] transition-colors"
                  >
                    <span
                      className="font-medium text-sm text-[var(--foreground)] truncate"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="text-sm text-[var(--muted-foreground)] truncate"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {cat.description ?? "—"}
                    </span>
                    <span
                      className="text-sm text-center text-[var(--muted-foreground)] tabular-nums"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {cat.order}
                    </span>
                    <span
                      className="text-sm text-right text-[var(--muted-foreground)] tabular-nums"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {cat._count.products}
                    </span>
                    <div className="flex items-center justify-end gap-1">
                      <CategoriaFormDialog
                        mode="edit"
                        categoryId={cat.id}
                        defaultValues={{
                          name: cat.name,
                          description: cat.description ?? "",
                          order: cat.order,
                        }}
                      />
                      <CategoriaDeleteDialog
                        id={cat.id}
                        name={cat.name}
                        productCount={cat._count.products}
                      />
                    </div>
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
