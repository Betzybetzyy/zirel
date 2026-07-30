import { Skeleton } from "./skeleton";

/**
 * Skeleton de la toolbar + grid (todo lo que vive dentro del <Suspense> de CatalogView).
 * Compartido entre loading.tsx (primera carga / navegación) y el fallback de Suspense
 * (necesario porque CatalogView usa useSearchParams).
 */
export function CatalogSkeleton() {
  return (
    <>
      <div className="border-y border-[var(--zirel-arena)]/40">
        <div className="mx-auto max-w-7xl px-6 flex gap-8 py-3.5 border-b border-[var(--zirel-arena)]/30">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 rounded-none opacity-40" />
          ))}
        </div>
        <div className="mx-auto max-w-7xl px-6 flex items-center gap-6 py-3.5">
          <Skeleton className="h-10 flex-1 max-w-xs rounded-none" />
          <Skeleton className="h-9 w-36 rounded-none" />
          <Skeleton className="h-9 w-24 rounded-none" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-square w-full rounded-none mb-4" />
              <Skeleton className="h-4 w-3/4 rounded-none mb-2" />
              <Skeleton className="h-3 w-1/2 rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
