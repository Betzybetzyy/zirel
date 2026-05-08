import { getCategoryBySlug, getCategories } from "@/lib/queries";
import { ProductGrid } from "@/components/ui/product-grid";
import { notFound } from "next/navigation";
import Link from "next/link";

// Genera las páginas estáticas en build (mejora performance)
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada" };

  return {
    title: `${category.name} | Zirel Joyería`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]/70 mb-8 text-center">
        <Link href="/" className="hover:text-[var(--zirel-dorado-beige)]">
          Inicio
        </Link>
        <span className="mx-2">·</span>
        <Link href="/catalogo" className="hover:text-[var(--zirel-dorado-beige)]">
          Catálogo
        </Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--zirel-negro-suave)]">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-16">
        <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-wide text-[var(--zirel-negro-suave)] mb-4">
          {category.name}
        </h1>
        <div className="w-24 h-px bg-[var(--zirel-dorado-beige)] mx-auto mb-4" />
        {category.description && (
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] max-w-md mx-auto">
            {category.description}
          </p>
        )}
        <p className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]/70 mt-6">
          {category.products.length}{" "}
          {category.products.length === 1 ? "pieza" : "piezas"}
        </p>
      </div>

      {/* Grilla */}
      <ProductGrid products={category.products} />
    </div>
  );
}