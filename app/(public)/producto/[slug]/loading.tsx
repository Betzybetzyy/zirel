import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <>
      {/* Breadcrumb skeleton */}
      <section className="pt-24 pb-6 px-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-2.5 w-72 rounded-none opacity-40" />
        </div>
      </section>

      {/* Main content skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Galería */}
          <div>
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="grid grid-cols-4 gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-none" />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <Skeleton className="h-2.5 w-24 rounded-none mb-4" />
              <div className="flex items-center gap-3 mb-5">
                <Skeleton className="h-9 w-64 rounded-none" />
                <Skeleton className="h-5 w-16 rounded-none" />
              </div>
              <Skeleton className="h-px w-12 rounded-none" />
            </div>

            <div className="mb-10 space-y-3">
              <Skeleton className="h-2.5 w-28 rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-2/3 rounded-none" />
            </div>

            <div className="mb-10 space-y-3">
              <Skeleton className="h-2.5 w-24 rounded-none mb-1" />
              <Skeleton className="h-9 w-full rounded-none" />
              <Skeleton className="h-9 w-full rounded-none" />
            </div>

            <div className="border-t border-[var(--zirel-arena)]/50 pt-8">
              <Skeleton className="h-8 w-32 rounded-none mb-6" />
              <Skeleton className="h-11 w-full md:w-48 rounded-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip skeleton */}
      <div className="border-t border-[var(--zirel-arena)]/40 py-7 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-2.5 w-20 rounded-none" />
              <Skeleton className="h-2 w-14 rounded-none opacity-50" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
