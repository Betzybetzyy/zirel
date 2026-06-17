import { ProductCard } from "./product-card";

type Product = {
  slug: string;
  name: string;
  price: number;
  images: { url: string; alt: string | null }[];
};

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]/40" />
        <p className="font-serif italic text-xl text-[var(--zirel-cafe-topo)]">
          Esta colección está vacía por ahora.
        </p>
        <p className="text-xs tracking-[0.25em] uppercase text-[var(--zirel-cafe-topo)]/55">
          Vuelve pronto — nuevas piezas en camino.
        </p>
        <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]/40" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          slug={product.slug}
          name={product.name}
          price={product.price}
          imageUrl={product.images[0]?.url}
          imageAlt={product.images[0]?.alt || undefined}
        />
      ))}
    </div>
  );
}
