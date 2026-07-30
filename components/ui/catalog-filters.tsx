"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./sheet";
import { Button } from "./button";
import { Switch } from "./switch";
import type { CatalogFilters as CatalogFiltersState, PriceBucket } from "@/lib/catalog-filter";

interface CatalogFiltersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buckets: PriceBucket[];
  materials: string[];
  sizes: string[];
  filters: CatalogFiltersState;
  onChange: (patch: Partial<CatalogFiltersState>) => void;
  onClear: () => void;
}

function ChipGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]/70 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(active ? null : opt.value)}
              className={`px-3 py-1.5 text-xs tracking-wide border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zirel-dorado-beige)] ${
                active
                  ? "border-[var(--zirel-dorado-beige)] bg-[var(--zirel-dorado-beige)]/15 text-[var(--zirel-negro-suave)]"
                  : "border-[var(--zirel-arena)] text-[var(--zirel-cafe-topo)] hover:border-[var(--zirel-dorado-beige)]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Panel de filtros — Sheet lateral, mismo patrón que cart-drawer.tsx. Un solo layout para todas las pantallas. */
export function CatalogFiltersPanel({
  open,
  onOpenChange,
  buckets,
  materials,
  sizes,
  filters,
  onChange,
  onClear,
}: CatalogFiltersPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[var(--zirel-marfil)] flex flex-col w-full sm:max-w-sm p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[var(--zirel-arena)]/40">
          <SheetTitle className="font-serif tracking-wide text-[var(--zirel-negro-suave)] text-xl">
            Filtros
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--zirel-cafe-topo)]/70">
              Solo disponibles
            </span>
            <Switch checked={filters.onlyAvailable} onCheckedChange={(v) => onChange({ onlyAvailable: v })} />
          </div>

          {buckets.length > 1 && (
            <ChipGroup
              label="Precio"
              options={buckets.map((b) => ({ value: String(b.index), label: b.label }))}
              value={filters.priceBucket !== null ? String(filters.priceBucket) : null}
              onSelect={(v) => onChange({ priceBucket: v === null ? null : Number(v) })}
            />
          )}

          {materials.length > 1 && (
            <ChipGroup
              label="Material"
              options={materials.map((m) => ({ value: m, label: m }))}
              value={filters.material}
              onSelect={(v) => onChange({ material: v })}
            />
          )}

          {sizes.length > 1 && (
            <ChipGroup
              label="Talla"
              options={sizes.map((s) => ({ value: s, label: s }))}
              value={filters.size}
              onSelect={(v) => onChange({ size: v })}
            />
          )}
        </div>

        <SheetFooter className="border-t border-[var(--zirel-arena)]/40 flex-row gap-3 px-6 py-5">
          <Button variant="outline" className="flex-1 rounded-none" onClick={onClear}>
            Limpiar
          </Button>
          <Button className="flex-1 rounded-none" onClick={() => onOpenChange(false)}>
            Ver resultados
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
