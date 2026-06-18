import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getFeatureFlags } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Finalizar compra | Zirel Joyería",
  description: "Completa tu pedido de joyería Zirel. Coordinaremos el pago y envío por WhatsApp.",
  robots: { index: false, follow: false },
};

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = await getFeatureFlags();
  if (!flags.cart) {
    redirect("/catalogo");
  }
  return children;
}
