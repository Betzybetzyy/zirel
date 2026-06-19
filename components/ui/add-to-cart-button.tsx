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
  imageUrl?: string;
};

export function AddToCartButton({ productId, sku, slug, name, price, imageUrl }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem({ productId, sku, slug, name, price, imageUrl });
    setJustAdded(true);
    sileo.success({
      title: "Añadido al carrito",
      description: `${name} fue agregado exitosamente.`,
    });

    // Reset visual del botón
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Button
      onClick={handleAdd}
      size="lg"
      className="rounded-none w-full md:w-auto md:px-12"
    >
      {justAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Añadido
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Agregar al carrito
        </>
      )}
    </Button>
  );
}