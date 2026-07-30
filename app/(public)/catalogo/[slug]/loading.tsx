import { Skeleton } from "@/components/ui/skeleton";
import { CatalogSkeleton } from "@/components/ui/catalog-skeleton";

export default function CategoryLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="flex flex-col items-center justify-center pt-24 pb-12 px-6 text-center">
        <Skeleton className="h-3 w-48 mx-auto rounded-none mb-6" />
        <Skeleton className="h-3 w-28 mx-auto rounded-none mb-4" />
        <Skeleton className="h-12 w-64 mx-auto rounded-none mb-5" />
        <Skeleton className="h-px w-16 mx-auto mb-5" />
        <Skeleton className="h-4 w-64 mx-auto rounded-none" />
      </section>

      <CatalogSkeleton />
    </>
  );
}
