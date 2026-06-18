import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getFeatureFlags } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Tu carrito | Zirel Joyería",
  description: "Revisa y gestiona los productos seleccionados antes de finalizar tu compra.",
  robots: { index: false, follow: false },
};

export default async function CarritoLayout({
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
