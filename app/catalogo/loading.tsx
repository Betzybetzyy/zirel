import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogoLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-16 space-y-4">
        <Skeleton className="h-4 w-4 mx-auto rounded-none" />
        <Skeleton className="h-12 w-48 mx-auto rounded-none" />
        <Skeleton className="h-px w-24 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto rounded-none" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="mt-3 space-y-2 text-center">
              <Skeleton className="h-4 w-3/4 mx-auto rounded-none" />
              <Skeleton className="h-3 w-1/2 mx-auto rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
