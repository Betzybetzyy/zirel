"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  /** Stock disponible al momento de agregar. Sin tope si no viene (items viejos en localStorage). */
  maxQuantity?: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { maxQuantity } = item;
        // stock 0 no debería llegar acá (el botón se deshabilita), pero por si acaso.
        if (maxQuantity !== undefined && maxQuantity <= 0) return;

        const existing = get().items.find((i) => i.productId === item.productId);

        if (existing) {
          const nextQuantity =
            maxQuantity !== undefined
              ? Math.min(existing.quantity + 1, maxQuantity)
              : existing.quantity + 1;
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: nextQuantity, maxQuantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) => {
            if (i.productId !== productId) return i;
            const capped = i.maxQuantity !== undefined ? Math.min(quantity, i.maxQuantity) : quantity;
            return { ...i, quantity: capped };
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      setOpen: (open) => set({ isOpen: open }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "zirel-cart",
    }
  )
);