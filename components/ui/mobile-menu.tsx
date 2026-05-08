"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

type Category = { id: string; name: string; slug: string };

export function MobileMenu({ categories }: { categories: Category[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[var(--zirel-marfil)]">
        <SheetHeader>
          <SheetTitle className="font-serif tracking-widest text-[var(--zirel-negro-suave)]">
            ZIREL
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6 mt-8 px-6">
          <Link
            href="/catalogo"
            className="text-sm tracking-widest uppercase text-[var(--zirel-negro-suave)]"
          >
            Catálogo completo
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo/${cat.slug}`}
              className="text-sm tracking-widest uppercase text-[var(--zirel-cafe-topo)]"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
