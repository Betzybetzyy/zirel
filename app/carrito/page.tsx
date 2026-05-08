"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatCLP } from "@/lib/utils-format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CarritoPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  // Evitar hidratación inconsistente
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
        <h1 className="font-serif text-5xl text-[var(--zirel-negro-suave)] mb-4">
          Tu carrito
        </h1>
        <div className="w-20 h-px bg-[var(--zirel-dorado-beige)] mx-auto" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 text-[var(--zirel-cafe-topo)]/40 mx-auto mb-6" />
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] mb-8">
            Aún no has agregado piezas a tu carrito.
          </p>
          <Button asChild size="lg" className="rounded-none px-8">
            <Link href="/catalogo">Explorar catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 md:gap-6 pb-6 border-b border-[var(--zirel-arena)]/40"
              >
                <Link
                  href={`/producto/${item.slug}`}
                  className="relative w-24 h-24 md:w-32 md:h-32 bg-[var(--zirel-beige-suave)] flex-shrink-0"
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/producto/${item.slug}`}
                      className="font-serif text-lg text-[var(--zirel-negro-suave)] hover:text-[var(--zirel-dorado-beige)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs tracking-wider text-[var(--zirel-cafe-topo)] mt-1 font-mono">
                      {item.sku}
                    </p>
                    <p className="text-sm text-[var(--zirel-cafe-topo)] mt-2">
                      {formatCLP(item.price)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-[var(--zirel-arena)]">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-3 py-1.5 hover:bg-[var(--zirel-beige-suave)] transition-colors"
                        aria-label="Disminuir"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-4 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-3 py-1.5 hover:bg-[var(--zirel-beige-suave)] transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-[var(--zirel-cafe-topo)]/70 hover:text-[var(--zirel-negro-suave)] flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Quitar
                    </button>
                  </div>
                </div>

                <p className="font-serif text-lg text-[var(--zirel-negro-suave)] tabular-nums">
                  {formatCLP(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--zirel-beige-suave)]/30 p-8 sticky top-28">
              <h2 className="font-serif text-2xl text-[var(--zirel-negro-suave)] mb-6">
                Resumen
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--zirel-cafe-topo)]">Subtotal</span>
                  <span className="text-[var(--zirel-negro-suave)] tabular-nums">
                    {formatCLP(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--zirel-cafe-topo)]">Despacho</span>
                  <span className="text-[var(--zirel-cafe-topo)] italic text-xs">
                    Por coordinar
                  </span>
                </div>
              </div>

              <Separator className="bg-[var(--zirel-arena)]/50 my-6" />

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                  Total
                </span>
                <span className="font-serif text-3xl text-[var(--zirel-negro-suave)] tabular-nums">
                  {formatCLP(subtotal)}
                </span>
              </div>

              <Button asChild size="lg" className="w-full rounded-none">
                <Link href="/checkout">Finalizar compra</Link>
              </Button>

              <p className="text-xs text-[var(--zirel-cafe-topo)]/70 italic text-center mt-4">
                ✦ Coordinaremos pago y envío por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}