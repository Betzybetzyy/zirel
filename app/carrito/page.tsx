"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatCLP } from "@/lib/utils-format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function CarritoPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="text-[var(--zirel-dorado-claro)] text-base mb-5 tracking-widest">✦</div>
        <h1 className="font-serif text-5xl text-[var(--zirel-negro-suave)] mb-5">
          Tu carrito
        </h1>
        <div className="w-16 h-px bg-[var(--zirel-dorado-beige)] mx-auto" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag
            className="h-14 w-14 text-[var(--zirel-arena)] mx-auto mb-7"
            strokeWidth={1}
          />
          <p className="font-serif italic text-[var(--zirel-cafe-topo)] text-lg mb-2">
            Aún no has agregado piezas.
          </p>
          <p className="text-sm text-[var(--zirel-cafe-topo)]/60 mb-10">
            Explora nuestras colecciones y encuentra algo especial.
          </p>
          <Button asChild size="lg" className="rounded-none px-10">
            <Link href="/catalogo">Explorar catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Item list */}
          <div className="lg:col-span-2">
            {/* Back link */}
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-xs tracking-wider text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-negro-suave)] transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="h-3 w-3" />
              Seguir explorando
            </Link>

            <div className="space-y-0">
              {items.map((item, index) => (
                <div
                  key={item.productId}
                  className={`flex gap-5 md:gap-8 py-7 ${
                    index < items.length - 1
                      ? "border-b border-[var(--zirel-arena)]/40"
                      : "border-b border-[var(--zirel-arena)]/40"
                  }`}
                >
                  {/* Two-layer image frame */}
                  <Link
                    href={`/producto/${item.slug}`}
                    className="relative flex-shrink-0 w-28 h-28 md:w-36 md:h-36 bg-[var(--zirel-beige-suave)] overflow-hidden group"
                  >
                    <div className="absolute inset-2 bg-white">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 112px, 144px"
                          className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href={`/producto/${item.slug}`}
                          className="font-serif text-lg leading-snug text-[var(--zirel-negro-suave)] hover:text-[var(--zirel-dorado-beige)] transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="flex-shrink-0 p-1 text-[var(--zirel-cafe-topo)]/40 hover:text-[var(--zirel-negro-suave)] transition-colors duration-200"
                          aria-label="Eliminar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[11px] tracking-widest text-[var(--zirel-cafe-topo)]/60 mt-1.5 font-mono uppercase">
                        {item.sku}
                      </p>
                      <p className="text-sm text-[var(--zirel-cafe-topo)] mt-2">
                        {formatCLP(item.price)} c/u
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-5">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[var(--zirel-arena)]">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-[var(--zirel-beige-suave)] active:scale-95 transition-all duration-150"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-[var(--zirel-beige-suave)] active:scale-95 transition-all duration-150"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="font-serif text-xl text-[var(--zirel-negro-suave)] tabular-nums">
                        {formatCLP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--zirel-beige-suave)]/60 border border-[var(--zirel-arena)]/50 p-8 sticky top-28">
              <h2 className="font-serif text-xl text-[var(--zirel-negro-suave)] mb-6 tracking-wide">
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
                  <span className="text-[var(--zirel-cafe-topo)]/70 italic text-xs">
                    Por coordinar
                  </span>
                </div>
              </div>

              <Separator className="bg-[var(--zirel-arena)]/60 my-6" />

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-[10px] tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                  Total
                </span>
                <span className="font-serif text-3xl text-[var(--zirel-negro-suave)] tabular-nums">
                  {formatCLP(subtotal)}
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full rounded-none bg-[var(--zirel-negro-suave)] text-[var(--zirel-marfil)] hover:bg-[var(--zirel-cafe-topo)] active:scale-[0.99] transition-all duration-200"
              >
                <Link href="/checkout">Finalizar compra</Link>
              </Button>

              <p className="text-[11px] text-[var(--zirel-cafe-topo)]/60 italic text-center mt-5 leading-relaxed">
                ✦ Coordinaremos pago y envío<br />por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
