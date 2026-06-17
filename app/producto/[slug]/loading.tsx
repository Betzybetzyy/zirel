import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <>
      {/* Header skeleton */}
      <section className="flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center">
        <Skeleton className="h-2.5 w-72 mb-8 rounded-none" />
        <Skeleton className="h-2.5 w-24 mb-5 rounded-none" />
        <Skeleton className="h-12 w-80 mb-5 rounded-none" />
        <Skeleton className="h-px w-16 mb-5 rounded-none" />
        <Skeleton className="h-6 w-28 rounded-none" />
      </section>

      {/* Dark strip skeleton */}
      <div className="bg-[var(--zirel-negro-suave)] py-5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="h-2.5 w-20 rounded-none bg-white/10" />
                <Skeleton className="h-2 w-14 rounded-none bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-6">
            <Skeleton className="h-2.5 w-32 rounded-none" />
            <Skeleton className="h-20 w-full rounded-none" />
            <Skeleton className="h-2.5 w-32 rounded-none" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-10 w-full rounded-none" />
            </div>
            <Skeleton className="h-px w-full rounded-none mt-4" />
            <Skeleton className="h-12 w-full rounded-none" />
          </div>
        </div>
      </section>
    </>
  );
}
