import { getProductBySlug, getFeatureFlags } from "@/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

function normalizeCloudinaryUrl(url: string, size = 1200): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${size},h_${size},c_pad,b_rgb:FFFFFF/`);
}

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
  const [product, flags] = await Promise.all([
    getProductBySlug(slug),
    getFeatureFlags(),
  ]);

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
    <>
      {/* HEADER con breadcrumb */}
      <section className="pt-24 pb-6 px-6">
        <div className="mx-auto max-w-7xl">
          <nav className="text-[9px] tracking-[0.35em] uppercase text-[var(--zirel-cafe-topo)]/60 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200">
              Inicio
            </Link>
            <span className="text-[var(--zirel-dorado-beige)]/40">·</span>
            <Link href="/catalogo" className="hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200">
              Catálogo
            </Link>
            <span className="text-[var(--zirel-dorado-beige)]/40">·</span>
            <Link
              href={`/catalogo/${product.category.slug}`}
              className="hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200"
            >
              {product.category.name}
            </Link>
            <span className="text-[var(--zirel-dorado-beige)]/40">·</span>
            <span className="text-[var(--zirel-negro-suave)]">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* GALERÍA */}
          <div>
            {/* Imagen principal con frame editorial */}
            <div className="relative">
              {/* Corner accent brackets */}
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />
              <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />
              <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />

              <div className="relative aspect-square bg-[var(--zirel-marfil)] overflow-hidden">
                {mainImage ? (
                  <Image
                    src={normalizeCloudinaryUrl(mainImage.url, 1200)}
                    alt={mainImage.alt || product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                                        priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--zirel-cafe-topo)]/40 font-serif italic text-sm">
                    Sin imagen
                  </div>
                )}
                {/* Uniform inner border */}
                <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(43,38,35,0.08)] pointer-events-none" />
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {product.images.map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative aspect-square overflow-hidden bg-[var(--zirel-marfil)] transition-all duration-200 ${
                      i === 0
                        ? "shadow-[inset_0_0_0_1.5px_var(--zirel-dorado-beige)]"
                        : "shadow-[inset_0_0_0_1px_rgba(43,38,35,0.08)] hover:shadow-[inset_0_0_0_1.5px_var(--zirel-dorado-beige)]"
                    }`}
                  >
                    <Image
                      src={normalizeCloudinaryUrl(img.url, 300)}
                      alt={img.alt || product.name}
                      fill
                      sizes="15vw"
                      className="object-contain"
                                          />
                  </div>
                ))}
              </div>
            )}

            {/* SKU debajo de imagen */}
            <p className="text-[9px] tracking-[0.35em] uppercase text-[var(--zirel-cafe-topo)]/35 mt-5 text-center">
              Ref. {product.sku}
            </p>
          </div>

          {/* INFO DEL PRODUCTO — sticky en desktop */}
          <div className="flex flex-col md:sticky md:top-32">

            {/* Título */}
            <div className="mb-10">
              <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-4">
                ✦ {product.category.name}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--zirel-negro-suave)] mb-5 leading-tight">
                {product.name}
              </h1>
              <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]" />
            </div>

            {/* Descripción */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase">
                  ✦ Descripción
                </span>
                <div className="flex-1 h-px bg-[var(--zirel-arena)]/50" />
              </div>
              <p className="font-serif text-[var(--zirel-negro-suave)] leading-relaxed text-[15px]">
                {product.description}
              </p>
            </div>

            {/* Detalles */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase">
                  ✦ Detalles
                </span>
                <div className="flex-1 h-px bg-[var(--zirel-arena)]/50" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-baseline py-2.5 border-b border-[var(--zirel-arena)]/30">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)]/70">
                    Material
                  </span>
                  <span className="font-serif text-[var(--zirel-negro-suave)] text-sm">
                    {product.material}
                  </span>
                </div>

                {product.size && (
                  <div className="flex justify-between items-baseline py-2.5 border-b border-[var(--zirel-arena)]/30">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)]/70">
                      Talla / Detalle
                    </span>
                    <span className="font-serif text-[var(--zirel-negro-suave)] text-sm">
                      {product.size}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline py-2.5">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--zirel-cafe-topo)]/70">
                    SKU
                  </span>
                  <span className="font-mono text-[11px] text-[var(--zirel-cafe-topo)]/60">
                    {product.sku}
                  </span>
                </div>
              </div>
            </div>

            {/* Precio + CTA */}
            <div className="border-t border-[var(--zirel-arena)]/50 pt-8">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]/60">
                  Precio
                </span>
                <span className="font-serif text-3xl text-[var(--zirel-negro-suave)] tracking-tight font-variant-numeric tabular-nums">
                  {formattedPrice}
                </span>
              </div>

              {flags.cart && (
                <AddToCartButton
                  productId={product.id}
                  sku={product.sku}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  imageUrl={mainImage?.url}
                />
              )}

              <div className="mt-8 pt-6 border-t border-[var(--zirel-arena)]/30">
                <Link
                  href="/catalogo"
                  className="block text-center text-[11px] tracking-[0.25em] uppercase text-[var(--zirel-cafe-topo)]/50 hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200"
                >
                  ← Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-t border-[var(--zirel-arena)]/40 bg-[var(--zirel-marfil)]/60 py-7 px-6">
        <ul className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-0 md:divide-x md:divide-[var(--zirel-arena)]/40">
          {[
            { label: product.material, sub: "Material" },
            { label: "Plata 925", sub: "Certificada" },
            { label: "Envío a Chile", sub: "Todo el país" },
            { label: "Pieza única", sub: "Seleccionada para ti" },
          ].map((item) => (
            <li key={item.sub} className="flex flex-col items-center text-center md:px-8 gap-1">
              <span className="text-[var(--zirel-cafe-topo)] text-[10px] tracking-[0.25em] uppercase font-medium">
                {item.label}
              </span>
              <span className="text-[var(--zirel-cafe-topo)]/40 text-[10px]">
                {item.sub}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* MANIFESTO */}
      <section className="bg-[var(--zirel-negro-suave)] py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-14 h-px bg-[var(--zirel-dorado-beige)]/35 mx-auto mb-10" />
          <blockquote className="font-serif text-2xl md:text-3xl text-[var(--zirel-marfil)] leading-snug italic">
            "Cada joya nace con la intención de acompañarte en los momentos que importan."
          </blockquote>
          <div className="w-14 h-px bg-[var(--zirel-dorado-beige)]/35 mx-auto mt-10 mb-7" />
          <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.4em] uppercase">
            Zirel Joyería · Oro & Plata
          </span>
        </div>
      </section>
    </>
  );
}
