import { getProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | Zirel Joyería`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(product.price);

  const mainImage = product.images[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]/70 mb-8">
        <Link href="/" className="hover:text-[var(--zirel-dorado-beige)]">
          Inicio
        </Link>
        <span className="mx-2">·</span>
        <Link
          href="/catalogo"
          className="hover:text-[var(--zirel-dorado-beige)]"
        >
          Catálogo
        </Link>
        <span className="mx-2">·</span>
        <Link
          href={`/catalogo/${product.category.slug}`}
          className="hover:text-[var(--zirel-dorado-beige)]"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--zirel-negro-suave)]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Galería de imágenes */}
        <div>
          <div className="aspect-square bg-[var(--zirel-beige-suave)] p-2">
            <div className="relative w-full h-full bg-white">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--zirel-cafe-topo)]/40">
                  Sin imagen
                </div>
              )}
            </div>
          </div>

          {/* Galería extra si hay más fotos */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden bg-[var(--zirel-beige-suave)]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)] mb-3">
            {product.category.name}
          </p>

          <h1 className="font-serif text-4xl md:text-5xl text-[var(--zirel-negro-suave)] leading-tight mb-6">
            {product.name}
          </h1>

          <p className="text-2xl tracking-wide text-[var(--zirel-negro-suave)] mb-8">
            {formattedPrice}
          </p>

          <Separator className="bg-[var(--zirel-arena)]/50 mb-8" />

          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)] mb-3">
              Descripción
            </h2>
            <p className="font-serif text-[var(--zirel-negro-suave)] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Detalles */}
          <div className="space-y-3 mb-10">
            <h2 className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)] mb-3">
              Detalles
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-[var(--zirel-cafe-topo)]">Material</span>
              <span className="text-[var(--zirel-negro-suave)]">
                {product.material}
              </span>

              {product.size && (
                <>
                  <span className="text-[var(--zirel-cafe-topo)]">
                    Talla / Detalle
                  </span>
                  <span className="text-[var(--zirel-negro-suave)]">
                    {product.size}
                  </span>
                </>
              )}

              <span className="text-[var(--zirel-cafe-topo)]">SKU</span>
              <span className="text-[var(--zirel-negro-suave)] font-mono text-xs">
                {product.sku}
              </span>
            </div>
          </div>

          <AddToCartButton
            productId={product.id}
            sku={product.sku}
            slug={product.slug}
            name={product.name}
            price={product.price}
            imageUrl={mainImage?.url}
          />
        </div>
      </div>
    </div>
  );
}