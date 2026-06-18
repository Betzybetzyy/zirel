import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { CartButton } from "./cart-button";
import { CartDrawer } from "./cart-drawer";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";
import { PublicLogo } from "./public-logo";

interface HeaderProps {
  cartEnabled?: boolean;
}

export async function Header({ cartEnabled = true }: HeaderProps) {
  const categories = await getCategories();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--zirel-arena)]/40 bg-[var(--zirel-marfil)]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <PublicLogo priority />
            </Link>

            {/* Navegación desktop */}
            <NavLinks categories={categories} />

            {/* Acciones derecha */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {cartEnabled && <CartButton />}
              <div className="md:hidden">
                <MobileMenu categories={categories} />
              </div>
            </div>
          </div>
        </div>
      </header>
      {cartEnabled && <CartDrawer />}
    </>
  );
}
