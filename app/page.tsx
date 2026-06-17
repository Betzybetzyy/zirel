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
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-6 py-20 text-center overflow-hidden">
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, var(--zirel-beige-suave) 0%, transparent 70%)",
          }}
        />
        {/* Decorative corner lines */}
        <div className="absolute top-12 left-12 w-16 h-16 border-t border-l border-[var(--zirel-dorado-beige)]/40 pointer-events-none hidden md:block" />
        <div className="absolute top-12 right-12 w-16 h-16 border-t border-r border-[var(--zirel-dorado-beige)]/40 pointer-events-none hidden md:block" />
        <div className="absolute bottom-12 left-12 w-16 h-16 border-b border-l border-[var(--zirel-dorado-beige)]/40 pointer-events-none hidden md:block" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border-b border-r border-[var(--zirel-dorado-beige)]/40 pointer-events-none hidden md:block" />

        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Zirel Joyería"
            width={1100}
            height={505}
            className="w-64 md:w-[22rem] h-auto mix-blend-multiply"
            priority
          />
          <div className="w-px h-12 bg-[var(--zirel-dorado-beige)]/50 mt-10" />
          <p className="font-serif italic text-lg md:text-xl text-[var(--zirel-cafe-topo)] mt-6 max-w-sm leading-relaxed">
            Lujo sutil, sofisticación y delicadeza en cada pieza.
          </p>
          <div className="flex gap-4 mt-10">
            <Button asChild size="lg" className="rounded-none px-10 transition-all duration-300 active:scale-[0.97]">
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="bg-[var(--zirel-beige-suave)]/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--zirel-negro-suave)] mb-4">
              Nuestras colecciones
            </h2>
            <div className="w-20 h-px bg-[var(--zirel-dorado-beige)] mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className="group relative flex flex-col justify-between p-8 md:p-10 bg-[var(--zirel-marfil)] border border-transparent hover:border-[var(--zirel-dorado-beige)]/50 hover:bg-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ minHeight: "180px" }}
              >
                <span className="text-[var(--zirel-dorado-beige)]/60 text-xs">✦</span>
                <div>
                  <p className="font-serif text-2xl md:text-3xl text-[var(--zirel-negro-suave)] mb-3 group-hover:text-[var(--zirel-cafe-topo)] transition-colors duration-300 leading-tight">
                    {cat.name}
                  </p>
                  <span className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]/60 group-hover:text-[var(--zirel-dorado-beige)] transition-colors duration-300">
                    Explorar
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--zirel-negro-suave)] mb-4">
              Piezas destacadas
            </h2>
            <div className="w-20 h-px bg-[var(--zirel-dorado-beige)] mx-auto mb-4" />
            <p className="font-serif italic text-[var(--zirel-cafe-topo)]">
              Una pequeña muestra de nuestra colección.
            </p>
          </div>

          <ProductGrid products={featured} />

          <div className="text-center mt-16">
            <Button asChild size="lg" variant="outline" className="rounded-none px-8">
              <Link href="/catalogo">Ver todo el catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}