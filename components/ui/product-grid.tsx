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
      <div className="text-center py-20 text-[var(--zirel-cafe-topo)]">
        <p className="font-serif italic">No hay productos disponibles en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
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