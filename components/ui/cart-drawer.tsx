"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="bg-[var(--zirel-marfil)] flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[var(--zirel-arena)]/40">
          <div className="flex items-baseline gap-3">
            <SheetTitle className="font-serif tracking-wide text-[var(--zirel-negro-suave)] text-xl">
              Tu carrito
            </SheetTitle>
            {totalItems > 0 && (
              <span className="text-xs tracking-widest text-[var(--zirel-cafe-topo)] tabular-nums">
                {totalItems} {totalItems === 1 ? "pieza" : "piezas"}
              </span>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <ShoppingBag className="h-10 w-10 text-[var(--zirel-arena)] mb-5" strokeWidth={1} />
            <p className="font-serif italic text-[var(--zirel-cafe-topo)] text-sm mb-1">
              Tu carrito está vacío
            </p>
            <p className="text-xs text-[var(--zirel-cafe-topo)]/60 mb-8">
              Explora nuestras piezas y encuentra algo especial.
            </p>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="rounded-none border-[var(--zirel-negro-suave)] text-[var(--zirel-negro-suave)] hover:bg-[var(--zirel-negro-suave)] hover:text-[var(--zirel-marfil)] transition-colors duration-200"
              asChild
            >
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.productId}
                  className={`flex gap-4 px-6 py-5 ${
                    index < items.length - 1
                      ? "border-b border-[var(--zirel-arena)]/30"
                      : ""
                  }`}
                >
                  {/* Image — two-layer frame */}
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative w-[72px] h-[72px] flex-shrink-0 bg-[var(--zirel-beige-suave)] overflow-hidden group"
                  >
                    <div className="absolute inset-1 bg-white">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="72px"
                          className="object-contain p-0.5 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/producto/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-serif text-sm leading-snug text-[var(--zirel-negro-suave)] hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex-shrink-0 p-0.5 text-[var(--zirel-cafe-topo)]/40 hover:text-[var(--zirel-negro-suave)] transition-colors duration-200"
                        aria-label="Eliminar"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[var(--zirel-arena)]">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-[var(--zirel-beige-suave)] active:scale-95 transition-all duration-150"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-[var(--zirel-beige-suave)] active:scale-95 transition-all duration-150"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="font-serif text-sm text-[var(--zirel-negro-suave)] tabular-nums">
                        {formatCLP(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Unit price — only shown when qty > 1 */}
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-[var(--zirel-cafe-topo)]/60 mt-1">
                        {formatCLP(item.price)} c/u
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--zirel-arena)]/40 px-6 pt-5 pb-6 space-y-4">
              {/* Subtotal row */}
              <div className="flex justify-between items-baseline">
                <span className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                  Subtotal
                </span>
                <span className="font-serif text-2xl text-[var(--zirel-negro-suave)] tabular-nums">
                  {formatCLP(subtotal)}
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full rounded-none bg-[var(--zirel-negro-suave)] text-[var(--zirel-marfil)] hover:bg-[var(--zirel-cafe-topo)] active:scale-[0.99] transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                <Link href="/checkout">Finalizar compra</Link>
              </Button>

              <div className="text-center">
                <Link
                  href="/carrito"
                  onClick={() => setOpen(false)}
                  className="text-xs tracking-wider text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-negro-suave)] underline underline-offset-4 transition-colors duration-200"
                >
                  Ver carrito completo
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
