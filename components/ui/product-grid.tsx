import type { ReactNode } from "react";
import { ProductCard } from "./product-card";

type Product = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  images: { url: string; alt: string | null }[];
};

const EMPTY_COLLECTION = (
  <div className="py-24 flex flex-col items-center gap-6 text-center">
    <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]/40" />
    <p className="font-serif italic text-xl text-[var(--zirel-cafe-topo)]">Esta colección está vacía por ahora.</p>
    <p className="text-xs tracking-[0.25em] uppercase text-[var(--zirel-cafe-topo)]/55">
      Vuelve pronto — nuevas piezas en camino.
    </p>
    <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]/40" />
  </div>
);

export function ProductGrid({ products, emptyState }: { products: Product[]; emptyState?: ReactNode }) {
  if (products.length === 0) {
    return <>{emptyState ?? EMPTY_COLLECTION}</>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          slug={product.slug}
          name={product.name}
          price={product.price}
          stock={product.stock}
          imageUrl={product.images[0]?.url}
          imageAlt={product.images[0]?.alt || undefined}
        />
      ))}
    </div>
  );
}
