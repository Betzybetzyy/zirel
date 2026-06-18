import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Pedido confirmado | Zirel Joyería",
};

export default async function PedidoConfirmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; wsp?: string }>;
}) {
  const { n, wsp } = await searchParams;

  const orderNumber = n && /^\d+$/.test(String(n)) ? n : null;

  let whatsappUrl: string | null = null;
  if (wsp && typeof wsp === "string") {
    try {
      const decoded = decodeURIComponent(wsp);
      const url = new URL(decoded);
      if (url.hostname === "wa.me" && url.protocol === "https:") {
        whatsappUrl = decoded;
      }
    } catch {
      // URL inválida — ignorar
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <CheckCircle2 className="h-16 w-16 text-[var(--zirel-dorado-beige)] mx-auto mb-6" />

      <div className="text-[var(--zirel-dorado-claro)] text-lg mb-4">✦</div>
      <h1 className="font-serif text-5xl text-[var(--zirel-negro-suave)] mb-4">
        ¡Gracias por tu pedido!
      </h1>
      <div className="w-20 h-px bg-[var(--zirel-dorado-beige)] mx-auto mb-6" />

      {orderNumber && (
        <p className="text-sm tracking-widest uppercase text-[var(--zirel-cafe-topo)] mb-6">
          Pedido #{orderNumber}
        </p>
      )}

      <p className="font-serif italic text-lg text-[var(--zirel-cafe-topo)] max-w-md mx-auto mb-8">
        Tu pedido está registrado. Envíanos el resumen por WhatsApp para coordinar el pago y envío.
      </p>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium px-8 py-3 transition-colors mb-10"
        >
          Enviar pedido por WhatsApp
        </a>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <Button asChild size="lg" className="rounded-none px-8">
          <Link href="/catalogo">Seguir explorando</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-none px-8">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
