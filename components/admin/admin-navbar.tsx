"use client";

import Link from "next/link";
import { useAdminUIStore, type BreadcrumbItem } from "@/lib/admin-ui-store";

export function AdminNavbar() {
  const pageTitle = useAdminUIStore((s) => s.pageTitle);
  const breadcrumb = useAdminUIStore((s) => s.breadcrumb);

  return (
    <header className="sticky top-0 z-10 h-16 flex flex-col justify-center flex-shrink-0 bg-[var(--card)] border-b border-[var(--border)] shadow-[0_1px_4px_-1px_rgba(43,38,35,0.07)] px-6">
      {breadcrumb.length > 0 && (
        <nav className="mb-1" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            {breadcrumb.map((item: BreadcrumbItem, i: number) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span
                      className="text-[9px] text-[var(--zirel-arena)]"
                      aria-hidden
                    >
                      /
                    </span>
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-[9px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]/60 hover:text-[var(--zirel-dorado-beige)] transition-colors"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className="text-[9px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      {pageTitle && (
        <h1
          className="text-xl font-bold text-[var(--zirel-negro-suave)] leading-tight"
          style={{ fontFamily: "var(--font-baskerville)" }}
        >
          {pageTitle}
        </h1>
      )}
    </header>
  );
}
