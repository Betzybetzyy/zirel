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
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 py-20 text-center">
        <Image
          src="/logo.png"
          alt="Zirel Joyería"
          width={1100}
          height={505}
          className="w-72 md:w-96 h-auto mix-blend-multiply"
          priority
        />
        <p className="font-serif italic text-lg md:text-xl text-[var(--zirel-cafe-topo)] mt-12 max-w-md">
          Lujo sutil, sofisticación y delicadeza en cada pieza.
        </p>
        <div className="flex gap-4 mt-12">
          <Button asChild size="lg" className="rounded-none px-8">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className="group block text-center p-8 bg-[var(--zirel-marfil)] hover:bg-white transition-colors"
              >
                <p className="font-serif text-2xl text-[var(--zirel-negro-suave)] mb-2 group-hover:text-[var(--zirel-dorado-beige)] transition-colors">
                  {cat.name}
                </p>
                <span className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                  Ver →
                </span>
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