import Link from "next/link";
import { PublicLogo } from "@/components/ui/public-logo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--zirel-arena)]/40 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center text-center gap-4">
          <PublicLogo className="w-40 h-auto" />
          <div className="w-16 h-px bg-[var(--zirel-dorado-beige)] mt-2" />
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]">
            Joyería en plata y oro
          </p>
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] mt-4 max-w-sm leading-relaxed">
            Lujo sutil, sofisticación y delicadeza en cada pieza.
          </p>
          <a
            href="https://instagram.com/zireljoyas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Zirel Joyería"
            className="mt-4 flex items-center gap-2 text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-sm">@zireljoyas</span>
          </a>

          <div className="flex items-center gap-6 mt-8">
            <Link
              href="/politica-de-privacidad"
              className="text-xs text-[var(--zirel-cafe-topo)]/60 hover:text-[var(--zirel-cafe-topo)] transition-colors duration-200"
            >
              Política de privacidad
            </Link>
            <span className="text-[var(--zirel-arena)]">·</span>
            <Link
              href="/terminos"
              className="text-xs text-[var(--zirel-cafe-topo)]/60 hover:text-[var(--zirel-cafe-topo)] transition-colors duration-200"
            >
              Términos de uso
            </Link>
          </div>

          <p className="text-xs text-[var(--zirel-cafe-topo)]/50 mt-4">
            © {new Date().getFullYear()} Zirel Joyería. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
