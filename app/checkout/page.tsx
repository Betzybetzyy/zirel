"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatCLP } from "@/lib/utils-format";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { createOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerComuna: "",
    customerNotes: "",
  });

  useEffect(() => setMounted(true), []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setSubmitting(true);

    const result = await createOrder({
      ...form,
      items: items.map((i) => ({
        productId: i.productId,
        sku: i.sku,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    if (!result.success) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    // Generar mensaje y abrir WhatsApp
    const message = buildWhatsAppMessage(
      result.order.orderNumber,
      {
        name: form.customerName,
        email: form.customerEmail,
        phone: form.customerPhone,
        address: form.customerAddress,
        comuna: form.customerComuna,
        notes: form.customerNotes,
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
  };

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

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
        {/* Formulario */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-[var(--zirel-negro-suave)] border-b border-[var(--zirel-arena)]/40 pb-3">
            Datos de contacto
          </h2>

          <div>
            <Label htmlFor="customerName">Nombre completo *</Label>
            <Input
              id="customerName"
              required
              minLength={2}
              maxLength={100}
              value={form.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="rounded-none mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                required
                maxLength={254}
                value={form.customerEmail}
                onChange={(e) => handleChange("customerEmail", e.target.value)}
                className="rounded-none mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Teléfono *</Label>
              <Input
                id="customerPhone"
                required
                minLength={8}
                maxLength={20}
                placeholder="+56 9 ..."
                value={form.customerPhone}
                onChange={(e) => handleChange("customerPhone", e.target.value)}
                className="rounded-none mt-2"
              />
            </div>
          </div>

          <h2 className="font-serif text-2xl text-[var(--zirel-negro-suave)] border-b border-[var(--zirel-arena)]/40 pb-3 pt-4">
            Despacho
          </h2>

          <div>
            <Label htmlFor="customerAddress">Dirección</Label>
            <Input
              id="customerAddress"
              maxLength={200}
              placeholder="Calle, número, depto."
              value={form.customerAddress}
              onChange={(e) => handleChange("customerAddress", e.target.value)}
              className="rounded-none mt-2"
            />
          </div>

          <div>
            <Label htmlFor="customerComuna">Comuna</Label>
            <Input
              id="customerComuna"
              maxLength={100}
              value={form.customerComuna}
              onChange={(e) => handleChange("customerComuna", e.target.value)}
              className="rounded-none mt-2"
            />
          </div>

          <div>
            <Label htmlFor="customerNotes">Comentarios (opcional)</Label>
            <Textarea
              id="customerNotes"
              maxLength={500}
              placeholder="¿Alguna preferencia o instrucción especial?"
              value={form.customerNotes}
              onChange={(e) => handleChange("customerNotes", e.target.value)}
              className="rounded-none mt-2 min-h-24"
            />
          </div>
        </div>

        {/* Resumen */}
        <div>
          <div className="bg-[var(--zirel-beige-suave)]/30 p-8 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-[var(--zirel-negro-suave)] mb-6">
              Tu pedido
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 bg-[var(--zirel-marfil)] flex-shrink-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                    <span className="absolute -top-1 -right-1 bg-[var(--zirel-negro-suave)] text-[var(--zirel-marfil)] text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--zirel-negro-suave)] line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--zirel-cafe-topo)]">
                      {formatCLP(item.price)}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums">
                    {formatCLP(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-[var(--zirel-arena)]/50 mb-4" />

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-[var(--zirel-cafe-topo)]">Subtotal</span>
                <span>{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--zirel-cafe-topo)]">Despacho</span>
                <span className="text-[var(--zirel-cafe-topo)] italic text-xs">
                  Por coordinar
                </span>
              </div>
            </div>

            <Separator className="bg-[var(--zirel-arena)]/50 mb-4" />

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-xs tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
                Total
              </span>
              <span className="font-serif text-3xl text-[var(--zirel-negro-suave)] tabular-nums">
                {formatCLP(subtotal)}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-none"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar por WhatsApp"
              )}
            </Button>

            <p className="text-xs text-[var(--zirel-cafe-topo)]/70 italic text-center mt-4">
              ✦ Te abriremos WhatsApp con el resumen del pedido.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}