import { getProductBySlug, getFeatureFlags } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { ProductGallery } from "@/components/ui/product-gallery";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StockBadge } from "@/components/ui/stock-badge";
import { Badge } from "@/components/ui/badge";

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

  return (
    <>
      {/* HEADER con breadcrumb */}
      <section className="pt-24 pb-6 px-6">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Catálogo", href: "/catalogo" },
              { label: product.category.name, href: `/catalogo/${product.category.slug}` },
              { label: product.name },
            ]}
          />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* GALERÍA */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* INFO DEL PRODUCTO — sticky en desktop */}
          <div className="flex flex-col md:sticky md:top-32">

            {/* Título */}
            <div className="mb-10">
              <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-4">
                ✦ {product.category.name}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--zirel-negro-suave)] leading-tight mb-5">
                {product.name}{" "}
                <Badge className="align-middle border border-[var(--zirel-arena)] px-2.5 py-1 text-[9px] tracking-[0.15em] text-[var(--zirel-cafe-topo)] font-mono">
                  {product.sku}
                </Badge>
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
                    Disponibilidad
                  </span>
                  <span className="font-serif text-[var(--zirel-negro-suave)] text-sm">
                    {product.stock > 0 ? "En stock" : "Agotado"}
                  </span>
                </div>
              </div>
            </div>

            {/* Precio + CTA */}
            <div className="border-t border-[var(--zirel-arena)]/50 pt-8">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]/60">
                  Precio
                </span>
                <span className="font-serif text-3xl text-[var(--zirel-negro-suave)] tracking-tight font-variant-numeric tabular-nums">
                  {formattedPrice}
                </span>
              </div>

              <div className="mb-6">
                <StockBadge stock={product.stock} className="inline-block" />
              </div>

              {flags.cart && (
                <AddToCartButton
                  productId={product.id}
                  sku={product.sku}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  imageUrl={product.images[0]?.url}
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
              <span className="text-[var(--trust-label)] text-[10px] tracking-[0.25em] uppercase font-medium">
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
            &ldquo;Cada joya nace con la intención de acompañarte en los momentos que importan.&rdquo;
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
