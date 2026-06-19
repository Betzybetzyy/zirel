"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatCLP } from "@/lib/utils-format";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { createOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerInput } from "@/lib/schemas/order";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const form = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerComuna: "",
      customerNotes: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (items.length === 0) {
      sileo.error({
        title: "Carrito vacío",
        description: "Agrega productos antes de continuar.",
      });
      return;
    }

    const result = await createOrder({
      ...data,
      items: items.map((i) => ({
        productId: i.productId,
        sku: i.sku,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    if (!result.success) {
      sileo.error({
        title: "Error en el pedido",
        description: result.error ?? "Inténtalo nuevamente.",
      });
      return;
    }

    const message = buildWhatsAppMessage(
      result.order.orderNumber,
      {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        address: data.customerAddress,
        comuna: data.customerComuna,
        notes: data.customerNotes,
      },
      items,
      subtotal
    );

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const whatsappUrl = buildWhatsAppUrl(whatsappNumber, message);

    clearCart();
    router.push(
      `/pedido-confirmado?n=${result.order.orderNumber}&wsp=${encodeURIComponent(whatsappUrl)}`
    );
  });

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-4xl text-[var(--zirel-negro-suave)] mb-4">
          Tu carrito está vacío
        </h1>
        <p className="font-serif italic text-[var(--zirel-cafe-topo)] mb-8">
          Agrega productos antes de finalizar tu compra.
        </p>
        <Button asChild size="lg" className="rounded-none px-8">
          <Link href="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
        <h1 className="font-serif text-5xl text-[var(--zirel-negro-suave)] mb-4">
          Finalizar compra
        </h1>
        <div className="w-20 h-px bg-[var(--zirel-dorado-beige)] mx-auto mb-4" />
        <p className="font-serif italic text-[var(--zirel-cafe-topo)] max-w-md mx-auto">
          Completa tus datos y te abriremos WhatsApp para coordinar el pago y envío.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Formulario */}
          <div className="lg:col-span-3 space-y-6">
            <Link
              href="/carrito"
              className="inline-flex items-center gap-2 text-xs tracking-wider text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-negro-suave)] transition-colors duration-200 mb-2"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver al carrito
            </Link>

            <h2 className="font-serif text-2xl text-[var(--zirel-negro-suave)] border-b border-[var(--zirel-arena)]/40 pb-3">
              Datos de contacto
            </h2>

            <TextField
              name="customerName"
              label="Nombre completo"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <TextField
                name="customerEmail"
                label="Email"
                type="email"
                required
              />
              <TextField
                name="customerPhone"
                label="Teléfono"
                type="tel"
                placeholder="+56 9 ..."
                required
              />
            </div>

            <h2 className="font-serif text-2xl text-[var(--zirel-negro-suave)] border-b border-[var(--zirel-arena)]/40 pb-3 pt-4">
              Despacho
            </h2>

            <TextField
              name="customerAddress"
              label="Dirección"
              placeholder="Calle, número, depto."
            />

            <TextField
              name="customerComuna"
              label="Comuna"
            />

            <TextField
              name="customerNotes"
              label="Comentarios (opcional)"
              placeholder="¿Alguna preferencia o instrucción especial?"
              multiline
            />
          </div>

          {/* Resumen */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--zirel-beige-suave)]/60 border border-[var(--zirel-arena)]/50 p-8 lg:sticky lg:top-28">
              <h2 className="font-serif text-xl text-[var(--zirel-negro-suave)] mb-6 tracking-wide">
                Tu pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="relative flex-shrink-0 w-16 h-16 bg-[var(--zirel-beige-suave)]">
                      <div className="absolute inset-1.5 bg-white overflow-hidden">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain p-0.5"
                          />
                        )}
                      </div>
                      <span className="absolute -top-1 -right-1 bg-[var(--zirel-negro-suave)] text-[var(--zirel-marfil)] text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--zirel-negro-suave)] line-clamp-1 font-serif leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[var(--zirel-cafe-topo)]/70 mt-0.5">
                        {formatCLP(item.price)} c/u
                      </p>
                    </div>
                    <span className="text-sm tabular-nums text-[var(--zirel-negro-suave)]">
                      {formatCLP(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-[var(--zirel-arena)]/60 mb-4" />

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[var(--zirel-cafe-topo)]">Subtotal</span>
                  <span className="text-[var(--zirel-negro-suave)] tabular-nums">{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--zirel-cafe-topo)]">Despacho</span>
                  <span className="text-[var(--zirel-cafe-topo)]/70 italic text-xs">
                    Por coordinar
                  </span>
                </div>
              </div>

              <Separator className="bg-[var(--zirel-arena)]/60 mb-6" />

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-[10px] tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                  Total
                </span>
                <span className="font-serif text-3xl text-[var(--zirel-negro-suave)] tabular-nums">
                  {formatCLP(subtotal)}
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-none bg-[var(--zirel-negro-suave)] text-[var(--zirel-marfil)] hover:bg-[var(--zirel-cafe-topo)] active:scale-[0.99] transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Confirmar por WhatsApp"
                )}
              </Button>

              <p className="text-[11px] text-[var(--zirel-cafe-topo)]/60 italic text-center mt-5 leading-relaxed">
                ✦ Te abriremos WhatsApp con el resumen del pedido.
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
