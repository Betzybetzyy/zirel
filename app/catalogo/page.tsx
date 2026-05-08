import { getAllProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/ui/product-grid";

export const revalidate = 3600;

export const metadata = {
  title: "Catálogo | Zirel Joyería",
  description: "Descubre toda nuestra colección de joyería en plata 925.",
};

export default async function CatalogoPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header de la página */}
      <div className="text-center mb-16">
        <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-wide text-[var(--zirel-negro-suave)] mb-4">
          Catálogo
        </h1>
        <div className="w-24 h-px bg-[var(--zirel-dorado-beige)] mx-auto mb-4" />
        <p className="font-serif italic text-[var(--zirel-cafe-topo)] max-w-md mx-auto">
          Cada pieza, cuidadosamente seleccionada para ti.
        </p>
        <p className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]/70 mt-6">
          {products.length} {products.length === 1 ? "pieza" : "piezas"} disponibles
        </p>
      </div>

      {/* Grilla de productos */}
      <ProductGrid products={products} />
    </div>
  );
}