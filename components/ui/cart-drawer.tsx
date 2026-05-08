"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { formatCLP } from "@/lib/utils-format";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="bg-[var(--zirel-marfil)] flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif tracking-wide text-[var(--zirel-negro-suave)] text-2xl">
            Tu carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag className="h-12 w-12 text-[var(--zirel-cafe-topo)]/40 mb-4" />
            <p className="font-serif italic text-[var(--zirel-cafe-topo)] mb-6">
              Tu carrito está vacío
            </p>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="rounded-none"
              asChild
            >
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  {/* Imagen */}
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative w-20 h-20 bg-[var(--zirel-beige-suave)] flex-shrink-0"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  {/* Detalles */}
                  <div className="flex-1 flex flex-col">
                    <Link
                      href={`/producto/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="font-serif text-sm text-[var(--zirel-negro-suave)] hover:text-[var(--zirel-dorado-beige)] transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[var(--zirel-cafe-topo)] mt-1">
                      {formatCLP(item.price)}
                    </p>

                    {/* Controles cantidad */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex items-center border border-[var(--zirel-arena)]">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="px-2 py-1 hover:bg-[var(--zirel-beige-suave)] transition-colors"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2 py-1 hover:bg-[var(--zirel-beige-suave)] transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-[var(--zirel-cafe-topo)]/70 hover:text-[var(--zirel-negro-suave)] flex items-center gap-1"
                        aria-label="Eliminar"
                      >
                        <X className="h-3 w-3" />
                        Quitar
                      </button>
                    </div>
                  </div>

                  {/* Subtotal del item */}
                  <p className="text-sm text-[var(--zirel-negro-suave)] tabular-nums">
                    {formatCLP(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer con total y CTA */}
            <SheetFooter className="border-t border-[var(--zirel-arena)]/40 pt-6 px-6">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl text-[var(--zirel-negro-suave)]">
                    {formatCLP(subtotal)}
                  </span>
                </div>
                <Separator className="bg-[var(--zirel-arena)]/50" />
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-none"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-none"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/carrito">Ver carrito completo</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}