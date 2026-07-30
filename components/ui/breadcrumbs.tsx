import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Migas de pan compartidas entre categoría y ficha de producto — antes duplicadas inline en cada page.tsx. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-[9px] tracking-[0.35em] uppercase text-[var(--zirel-cafe-topo)]/60 flex items-center gap-2 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-[var(--zirel-dorado-beige)]/40">·</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--zirel-negro-suave)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
