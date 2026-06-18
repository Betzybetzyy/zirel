import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finalizar compra | Zirel Joyería",
  description: "Completa tu pedido de joyería Zirel. Coordinaremos el pago y envío por WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
