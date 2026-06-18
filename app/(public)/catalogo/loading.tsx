import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogoLoading() {
  return (
    <>
      {/* Header skeleton */}
      <section className="flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center">
        <Skeleton className="h-3 w-36 mx-auto rounded-none mb-5" />
        <Skeleton className="h-14 w-56 mx-auto rounded-none mb-6" />
        <Skeleton className="h-px w-16 mx-auto mb-6" />
        <Skeleton className="h-4 w-64 mx-auto rounded-none" />
      </section>

      {/* Nav skeleton */}
      <div className="bg-[var(--zirel-negro-suave)] py-5">
        <div className="mx-auto max-w-7xl px-6 flex justify-center gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 rounded-none opacity-30" />
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <Skeleton className="h-3 w-40 rounded-none mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
          {Array.from({ length: 6 }).map((_, i) => (
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
