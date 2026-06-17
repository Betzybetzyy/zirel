"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = { id: string; slug: string; name: string };

export function NavLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  const links = [
    { href: "/catalogo", label: "Catálogo" },
    ...categories.map((cat) => ({
      href: `/catalogo/${cat.slug}`,
      label: cat.name,
    })),
  ];

  return (
    <nav className="hidden md:flex items-center gap-10">
      {links.map(({ href, label }) => {
        const active = pathname === href || (href !== "/catalogo" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm tracking-widest uppercase transition-colors duration-200",
              active
                ? "text-[var(--zirel-negro-suave)] border-b border-[var(--zirel-dorado-beige)]"
                : "text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-dorado-beige)]"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
