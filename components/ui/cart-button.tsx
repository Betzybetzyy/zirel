"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setOpen = useCartStore((state) => state.setOpen);

  // Hidratación: evita el "flash" de mostrar 0 antes de leer localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen(true)}
      className="relative"
      aria-label="Abrir carrito"
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--zirel-negro-suave)] text-[var(--zirel-marfil)] text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
}