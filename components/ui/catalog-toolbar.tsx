"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { SORT_OPTIONS, type SortOption } from "@/lib/catalog-filter";

interface CatalogToolbarProps {
  q: string;
  onQChange: (q: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

/** Barra sticky bajo el header: buscar + ordenar + filtros. Las categorías ya viven en el navbar — no se repiten acá. */
export function CatalogToolbar({
  q,
  onQChange,
  sort,
  onSortChange,
  resultCount,
  activeFilterCount,
  onOpenFilters,
}: CatalogToolbarProps) {
  return (
    <div className="sticky top-20 z-40 bg-[var(--zirel-marfil)]/95 backdrop-blur-sm border-b border-[var(--zirel-arena)]/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--zirel-cafe-topo)]/50 pointer-events-none" />
            <Input
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Buscar piezas"
              className="pl-6 text-sm"
              aria-label="Buscar en el catálogo"
            />
          </div>

          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger size="sm" aria-label="Ordenar por" className="min-w-[9rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="rounded-none gap-1.5" onClick={onOpenFilters}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-0.5 text-[var(--zirel-dorado-beige)] tabular-nums">({activeFilterCount})</span>
            )}
          </Button>

          <p className="ml-auto text-[10px] tracking-[0.25em] uppercase text-[var(--zirel-cafe-topo)]/60 tabular-nums shrink-0">
            {resultCount} {resultCount === 1 ? "pieza" : "piezas"}
          </p>
        </div>
      </div>
    </div>
  );
}
