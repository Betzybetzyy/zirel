"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "./product-grid";
import { CatalogToolbar } from "./catalog-toolbar";
import { CatalogFiltersPanel } from "./catalog-filters";
import { Button } from "./button";
import {
  computePriceBuckets,
  DEFAULT_FILTERS,
  filterProducts,
  hasActiveFilters,
  sortProducts,
  type CatalogFilters,
  type CatalogProduct,
  type SortOption,
} from "@/lib/catalog-filter";

interface CatalogViewProps {
  products: CatalogProduct[];
}

function parseFilters(params: URLSearchParams): CatalogFilters {
  return {
    q: params.get("q") ?? DEFAULT_FILTERS.q,
    sort: (params.get("sort") as SortOption) || DEFAULT_FILTERS.sort,
    priceBucket: params.has("precio") ? Number(params.get("precio")) : null,
    onlyAvailable: params.get("disp") === "1",
    material: params.get("mat"),
    size: params.get("talla"),
  };
}

function toSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.priceBucket !== null) params.set("precio", String(filters.priceBucket));
  if (filters.onlyAvailable) params.set("disp", "1");
  if (filters.material) params.set("mat", filters.material);
  if (filters.size) params.set("talla", filters.size);
  return params;
}

/** Orquesta el catálogo: filtros ↔ URL, set visible derivado, toolbar + panel + grid. Sin lógica de filtrado propia (ver lib/catalog-filter.ts). */
export function CatalogView({ products }: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Búsqueda: feedback instantáneo en el grid, escritura a la URL debounced
  // (cada tecla dispara un router.replace y no vale la pena pegarle al server en cada una).
  // Sync con la URL ajustado durante el render (patrón oficial de React para
  // "resetear estado cuando cambia una prop"), no en un efecto.
  const [prevUrlQ, setPrevUrlQ] = useState(filters.q);
  const [qDraft, setQDraft] = useState(filters.q);
  if (filters.q !== prevUrlQ) {
    setPrevUrlQ(filters.q);
    setQDraft(filters.q);
  }

  const updateFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const params = toSearchParams({ ...filters, ...patch });
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router]
  );

  useEffect(() => {
    if (qDraft === filters.q) return;
    const id = setTimeout(() => updateFilters({ q: qDraft }), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDraft]);

  const clearFilters = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router]);

  const buckets = useMemo(() => computePriceBuckets(products), [products]);
  const materials = useMemo(() => Array.from(new Set(products.map((p) => p.material))).sort(), [products]);
  const sizes = useMemo(
    () => Array.from(new Set(products.map((p) => p.size).filter((s): s is string => Boolean(s)))).sort(),
    [products]
  );

  const effectiveFilters = useMemo(() => ({ ...filters, q: qDraft }), [filters, qDraft]);

  const visible = useMemo(() => {
    const filtered = filterProducts(products, effectiveFilters, buckets);
    return sortProducts(filtered, effectiveFilters.sort);
  }, [products, effectiveFilters, buckets]);

  const activeFilterCount = [
    filters.priceBucket !== null,
    filters.onlyAvailable,
    Boolean(filters.material),
    Boolean(filters.size),
  ].filter(Boolean).length;

  return (
    <>
      <CatalogToolbar
        q={qDraft}
        onQChange={setQDraft}
        sort={filters.sort}
        onSortChange={(sort) => updateFilters({ sort })}
        resultCount={visible.length}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <CatalogFiltersPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        buckets={buckets}
        materials={materials}
        sizes={sizes}
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ProductGrid
          products={visible}
          emptyState={
            hasActiveFilters(effectiveFilters) ? (
              <div className="py-24 flex flex-col items-center gap-6 text-center">
                <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]/40" />
                <p className="font-serif italic text-xl text-[var(--zirel-cafe-topo)]">No hay piezas con esos filtros.</p>
                <Button variant="outline" size="sm" className="rounded-none" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
                <div className="w-12 h-px bg-[var(--zirel-dorado-beige)]/40" />
              </div>
            ) : undefined
          }
        />
      </section>
    </>
  );
}
