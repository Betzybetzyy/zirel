import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu carrito | Zirel Joyería",
  description: "Revisa y gestiona los productos seleccionados antes de finalizar tu compra.",
  robots: { index: false, follow: false },
};

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
