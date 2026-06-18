"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BreadcrumbItem = { label: string; href?: string };

type AdminUIStore = {
  /** Persisted */
  collapsed: boolean;
  toggleCollapsed: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  /** Not persisted — set by each page via <PageMeta /> */
  pageTitle: string;
  breadcrumb: BreadcrumbItem[];
  setPageMeta: (title: string, breadcrumb: BreadcrumbItem[]) => void;
};

export const useAdminUIStore = create<AdminUIStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),

      theme: "light",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      pageTitle: "",
      breadcrumb: [],
      setPageMeta: (pageTitle, breadcrumb) => set({ pageTitle, breadcrumb }),
    }),
    {
      name: "zirel-admin-sidebar",
      partialize: (state) => ({
        collapsed: state.collapsed,
        theme: state.theme,
      }),
      skipHydration: true,
    }
  )
);
