"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { sileo } from "sileo";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

export function AddToCartButton({ productId, sku, slug, name, price, stock, imageUrl }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const [justAdded, setJustAdded] = useState(false);

  const soldOut = stock <= 0;
  const inCart = items.find((i) => i.productId === productId)?.quantity ?? 0;
  const atLimit = !soldOut && inCart >= stock;

  const handleAdd = () => {
    if (atLimit) {
      sileo.error({
        title: "Sin más stock",
        description: `Ya tienes en el carrito todo el stock disponible de ${name}.`,
      });
      return;
    }

    addItem({ productId, sku, slug, name, price, imageUrl, maxQuantity: stock });
    setJustAdded(true);
    sileo.success({
      title: "Añadido al carrito",
      description: `${name} fue agregado exitosamente.`,
    });

    // Reset visual del botón
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (soldOut) {
    return (
      <Button size="lg" className="rounded-none w-full md:w-auto md:px-12" disabled>
        Sin stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      size="lg"
      className="rounded-none w-full md:w-auto md:px-12"
      disabled={atLimit}
    >
      {justAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Añadido
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {atLimit ? "Máximo en carrito" : "Agregar al carrito"}
        </>
      )}
    </Button>
  );
}
