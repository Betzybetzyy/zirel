import Link from "next/link";
import { getAllProducts, getCategories } from "@/lib/queries";
import { ProductGrid } from "@/components/ui/product-grid";

export const revalidate = 3600;

export const metadata = {
  title: "Catálogo | Zirel Joyería",
  description: "Descubre toda nuestra colección de joyería en plata 925.",
};

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* HEADER */}
      <section className="relative flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 70% at 50% 44%, var(--zirel-beige-suave) 0%, transparent 70%)",
          }}
        />

        {/* Corner brackets */}
        <div className="absolute top-10 left-10 w-10 h-10 border-t border-l border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
        <div className="absolute top-10 right-10 w-10 h-10 border-t border-r border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
        <div className="absolute bottom-8 left-10 w-10 h-10 border-b border-l border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
        <div className="absolute bottom-8 right-10 w-10 h-10 border-b border-r border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-5">
            ✦ Colección completa
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[var(--zirel-negro-suave)] mb-6">
            Catálogo
          </h1>
          <div className="w-16 h-px bg-[var(--zirel-dorado-beige)] mb-6" />
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] max-w-sm leading-relaxed">
            Cada pieza, cuidadosamente seleccionada para ti.
          </p>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <div className="bg-[var(--zirel-negro-suave)] py-5">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="flex items-center gap-x-8 gap-y-3 overflow-x-auto scrollbar-none pb-0.5">
            <li className="shrink-0">
              <span className="text-[var(--zirel-dorado-beige)] text-xs tracking-[0.2em] uppercase font-medium cursor-default">
                Todo
              </span>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="shrink-0">
                <Link
                  href={`/catalogo/${cat.slug}`}
                  className="text-[var(--zirel-marfil)]/50 hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200 text-xs tracking-[0.2em] uppercase"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--zirel-arena)]/40">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]/60">
            {products.length} {products.length === 1 ? "pieza disponible" : "piezas disponibles"}
          </p>
          <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.25em] uppercase">
            ✦ Colección
          </span>
        </div>

        <ProductGrid products={products} />
      </section>
    </>
  );
}
