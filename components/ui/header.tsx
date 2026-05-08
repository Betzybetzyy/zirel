import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { getCategories } from "@/lib/queries";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--zirel-arena)]/40 bg-[var(--zirel-marfil)]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo-alt.png"
              alt="Zirel Joyería"
              width={1100}
              height={387}
              className="h-14 w-auto mix-blend-multiply"
              priority
            />
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/catalogo"
              className="text-sm tracking-widest uppercase text-[var(--zirel-negro-suave)] hover:text-[var(--zirel-dorado-beige)] transition-colors"
            >
              Catálogo
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className="text-sm tracking-widest uppercase text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-dorado-beige)] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[var(--zirel-marfil)]">
              <SheetHeader>
                <SheetTitle>
                  <Image
                    src="/logo-alt.png"
                    alt="Zirel Joyería"
                    width={1100}
                    height={505}
                    className="h-16 w-auto mix-blend-multiply"
                  />
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
        </div>
      </div>
    </header>
  );
}