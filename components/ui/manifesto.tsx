interface ManifestoProps {
  quote: string;
  caption?: string;
  size?: "sm" | "lg";
}

/**
 * Bloque de cita editorial (línea dorada + blockquote itálico + línea + caption).
 * Reutilizado en home y ficha de producto.
 */
export function Manifesto({
  quote,
  caption = "Zirel Joyería · Oro & Plata",
  size = "lg",
}: ManifestoProps) {
  const lg = size === "lg";
  return (
    <section className={`bg-[var(--surface-inverse)] px-6 ${lg ? "py-28" : "py-24"}`}>
      <div className="mx-auto max-w-2xl text-center">
        <div className={`w-14 h-px bg-[var(--zirel-dorado-beige)]/35 mx-auto ${lg ? "mb-12" : "mb-10"}`} />
        <blockquote
          className={`font-serif text-[var(--on-surface-inverse)] leading-snug italic ${
            lg ? "text-3xl md:text-4xl lg:text-[2.6rem]" : "text-2xl md:text-3xl"
          }`}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className={`w-14 h-px bg-[var(--zirel-dorado-beige)]/35 mx-auto ${lg ? "mt-12 mb-8" : "mt-10 mb-7"}`} />
        <span className="text-[var(--zirel-dorado-beige)] text-[10px] tracking-[0.4em] uppercase">
          {caption}
        </span>
      </div>
    </section>
  );
}
