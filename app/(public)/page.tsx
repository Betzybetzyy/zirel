import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ui/product-grid";
import { getFeaturedProducts, getCategories } from "@/lib/queries";

export default async function Home() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-6 py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 42%, var(--zirel-beige-suave) 0%, transparent 68%)",
          }}
        />

        {/* Corner brackets */}
        <div className="absolute top-10 left-10 w-10 h-10 border-t border-l border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
        <div className="absolute top-10 right-10 w-10 h-10 border-t border-r border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
        <div className="absolute bottom-14 left-10 w-10 h-10 border-b border-l border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
        <div className="absolute bottom-14 right-10 w-10 h-10 border-b border-r border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
          <Image
            src="/logo.png"
            alt="Zirel Joyería"
            width={1100}
            height={505}
            className="w-64 md:w-80 h-auto hero-logo"
            priority
          />

          <div className="w-px h-12 bg-[var(--zirel-dorado-beige)]/50 mt-10" />

          <p className="font-serif italic text-lg md:text-xl text-[var(--zirel-cafe-topo)] max-w-sm text-center leading-relaxed mt-10 mb-12">
            Lujo sutil, sofisticación y delicadeza en cada pieza.
          </p>

          <Button
            asChild
            size="lg"
            className="rounded-none px-12 transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
          >
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.35em] uppercase text-[var(--zirel-cafe-topo)]/40">
            Explorar
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--zirel-dorado-beige)]/40 to-transparent" />
        </div>
      </section>

      {/* BRAND VALUES STRIP */}
      <div className="bg-[var(--surface-inverse)] py-5">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-0 md:divide-x md:divide-[var(--zirel-marfil)]/10">
            {[
              { label: "Oro & Plata", sub: "Materiales de calidad" },
              { label: "Joyería seleccionada", sub: "Cada pieza, elegida para ti" },
              { label: "Todos los estilos", sub: "Para cada momento" },
              { label: "Envío a Chile", sub: "Todo el país" },
            ].map((item) => (
              <li
                key={item.label}
                className="flex flex-col items-center text-center md:px-8 gap-0.5"
              >
                <span className="text-[var(--zirel-dorado-beige)] text-xs tracking-[0.2em] uppercase font-medium">
                  {item.label}
                </span>
                <span className="text-[var(--on-surface-inverse)]/35 text-[11px]">
                  {item.sub}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <section id="colecciones" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            {/* Left: editorial header */}
            <div className="lg:sticky lg:top-32 flex flex-col gap-6">
              <div>
                <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-5">
                  ✦ Colecciones
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--zirel-negro-suave)] leading-tight">
                  Para cada estilo, una pieza perfecta.
                </h2>
              </div>
              <div className="w-10 h-px bg-[var(--zirel-dorado-beige)]" />
              <p className="font-serif italic text-[var(--zirel-cafe-topo)] leading-relaxed text-[15px]">
                Desde anillos delicados hasta collares con carácter. Explora cada colección y encuentra la que habla de ti.
              </p>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--zirel-negro-suave)] hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200 border-b border-[var(--zirel-arena)] hover:border-[var(--zirel-dorado-beige)] pb-1 self-start"
              >
                Ver catálogo completo
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Right: 2x2 category grid */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo/${cat.slug}`}
                  className="group relative flex flex-col justify-between bg-[var(--zirel-beige-suave)]/40 border border-transparent hover:border-[var(--zirel-dorado-beige)]/35 hover:bg-[var(--zirel-marfil)] transition-all duration-300 hover:-translate-y-0.5 p-7 md:p-9"
                  style={{ minHeight: "196px" }}
                >
                  <span className="text-[var(--zirel-dorado-beige)]/45 text-xs">✦</span>
                  <div>
                    <p className="font-serif text-2xl md:text-3xl text-[var(--zirel-negro-suave)] leading-tight mb-3 group-hover:translate-x-0.5 transition-transform duration-300">
                      {cat.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-px bg-[var(--zirel-dorado-beige)]/55 group-hover:w-7 transition-all duration-300 ease-out" />
                      <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--zirel-cafe-topo)]/55 group-hover:text-[var(--zirel-dorado-beige)] transition-colors duration-300">
                        Explorar
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="bg-[var(--zirel-beige-suave)]/20 py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-5">
                ✦ Selección
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--zirel-negro-suave)]">
                Piezas destacadas
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              size="default"
              className="rounded-none px-6 shrink-0 self-start md:self-auto"
            >
              <Link href="/catalogo">Ver catálogo completo →</Link>
            </Button>
          </div>

          <ProductGrid products={featured} />
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="bg-[var(--surface-inverse)] py-28 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-14 h-px bg-[var(--zirel-dorado-beige)]/35 mx-auto mb-12" />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] text-[var(--on-surface-inverse)] leading-snug italic">
            &ldquo;Cada joya nace con la intención de acompañarte en los momentos que importan.&rdquo;
          </blockquote>
          <div className="w-14 h-px bg-[var(--zirel-dorado-beige)]/35 mx-auto mt-12 mb-8" />
          <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.4em] uppercase">
            Zirel Joyería · Oro & Plata
          </span>
        </div>
      </section>
    </>
  );
}
