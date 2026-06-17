import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/queries";
import { CartButton } from "./cart-button";
import { CartDrawer } from "./cart-drawer";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export async function Header() {
  const categories = await getCategories();

  return (
    <>
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
            <NavLinks categories={categories} />

            {/* Acciones derecha */}
            <div className="flex items-center gap-2">
              <CartButton />
              <div className="md:hidden">
                <MobileMenu categories={categories} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
