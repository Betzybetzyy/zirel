import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[60dvh] px-6 py-24 text-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 70% at 50% 44%, var(--zirel-beige-suave) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-5">
          ✦ 404
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-[var(--zirel-negro-suave)] mb-5 leading-tight">
          Esta pieza ya no está en el catálogo.
        </h1>
        <div className="w-16 h-px bg-[var(--zirel-dorado-beige)] mb-6" />
        <p className="font-serif italic text-[var(--zirel-cafe-topo)] leading-relaxed mb-10">
          Puede que se haya movido o vendido. Revisa el catálogo completo o vuelve al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="rounded-none">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-none">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
