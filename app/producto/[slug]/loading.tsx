import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Skeleton className="h-3 w-64 mb-8 rounded-none" />
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="h-10 w-3/4 rounded-none" />
          <Skeleton className="h-8 w-32 rounded-none" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="h-16 w-full rounded-none" />
          <Skeleton className="h-12 w-48 rounded-none mt-4" />
        </div>
      </div>
    </div>
  );
}
