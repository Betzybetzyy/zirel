"use client";

import { useEffect } from "react";
import { useAdminUIStore, type BreadcrumbItem } from "@/lib/admin-ui-store";

type Props = {
  title: string;
  breadcrumb: BreadcrumbItem[];
};

/**
 * Invisible component dropped into any server page to set the admin
 * navbar title + breadcrumb via the shared store.
 */
export function PageMeta({ title, breadcrumb }: Props) {
  const setPageMeta = useAdminUIStore((s) => s.setPageMeta);

  useEffect(() => {
    setPageMeta(title, breadcrumb);
  }, [title, breadcrumb, setPageMeta]);

  return null;
}
