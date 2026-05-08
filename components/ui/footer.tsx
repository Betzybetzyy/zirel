import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--zirel-arena)]/40 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center text-center gap-4">
          <Image
            src="/logo-alt.png"
            alt="Zirel Joyería"
            width={1100}
            height={387}
            className="w-40 h-auto mix-blend-multiply"
          />
          <div className="w-16 h-px bg-[var(--zirel-dorado-beige)]" />
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]">
            Joyería
          </p>
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] mt-4 max-w-md">
            Lujo sutil, sofisticación y delicadeza en cada pieza.
          </p>
          <a
            href="https://instagram.com/zireljoyas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-dorado-beige)] transition-colors mt-6"
          >
            @zireljoyas
          </a>
          <p className="text-xs text-[var(--zirel-cafe-topo)]/70 mt-8">
            © {new Date().getFullYear()} Zirel Joyería. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
