import type { ReactNode } from "react";

interface CatalogHeroProps {
  eyebrow: string;
  title: string;
  description?: string | null;
  breadcrumbs?: ReactNode;
}

/**
 * Hero editorial compartido por /catalogo y /catalogo/[slug].
 * Versión compacta del hero original (pt-24/pb-12 en vez de pt-28/pb-20,
 * h1 más chico) para que la toolbar + primera fila de productos entren
 * más arriba en pantalla.
 */
export function CatalogHero({ eyebrow, title, description, breadcrumbs }: CatalogHeroProps) {
  return (
    <section className="relative flex flex-col items-center justify-center pt-24 pb-12 px-6 text-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 70% at 50% 44%, var(--zirel-beige-suave) 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-10 left-10 w-10 h-10 border-t border-l border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
      <div className="absolute top-10 right-10 w-10 h-10 border-t border-r border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-10 w-10 h-10 border-b border-l border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 right-10 w-10 h-10 border-b border-r border-[var(--zirel-dorado-beige)]/35 pointer-events-none hidden md:block" />

      <div className="relative z-10 flex flex-col items-center">
        {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}

        <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.35em] uppercase block mb-4">
          ✦ {eyebrow}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--zirel-negro-suave)] mb-5">{title}</h1>
        <div className="w-16 h-px bg-[var(--zirel-dorado-beige)] mb-5" />
        {description && (
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] max-w-sm leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
