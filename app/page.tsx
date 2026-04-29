import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {/* Destello superior */}
      <div className="text-[var(--zirel-dorado-claro)] text-2xl mb-4">✦</div>

      {/* Logo */}
      <h1 className="font-serif text-7xl md:text-9xl tracking-wider text-[var(--zirel-negro-suave)]">
        ZIREL
      </h1>

      {/* Línea decorativa */}
      <div className="w-32 h-px bg-[var(--zirel-dorado-beige)] my-3" />

      {/* Descriptor */}
      <p className="font-sans text-sm md:text-base tracking-[0.3em] text-[var(--zirel-cafe-topo)] uppercase">
        Joyería
      </p>

      {/* Tagline */}
      <p className="font-serif italic text-lg md:text-xl text-[var(--zirel-cafe-topo)] mt-12 max-w-md text-center">
        Lujo sutil, sofisticación y delicadeza en cada pieza.
      </p>

      {/* CTA */}
      <div className="flex gap-4 mt-12">
        <Button size="lg" className="rounded-none px-8">
          Ver catálogo
        </Button>
        <Button size="lg" variant="outline" className="rounded-none px-8">
          Sobre Zirel
        </Button>
      </div>

      {/* Footer mínimo */}
      <p className="font-sans text-xs tracking-widest text-[var(--zirel-cafe-topo)] mt-24 uppercase">
        Próximamente
      </p>
    </main>
  );
}