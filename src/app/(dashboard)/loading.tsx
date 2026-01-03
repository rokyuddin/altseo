
import { Skeleton } from "@/components/atoms/skeleton";

export default function DashboardLoading() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12 space-y-8 relative z-10">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <Skeleton className="h-10 w-48 md:h-14 md:w-64 rounded-xl" />
        <Skeleton className="h-6 w-full max-w-md rounded-lg" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm dark:bg-card/30 rounded-4xl p-6 md:p-8 border border-white/60 dark:border-border/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-[1.25rem]" />
            </div>
            <Skeleton className="h-4 w-16 mb-2 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Recent Results Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm dark:bg-card/30 rounded-4xl overflow-hidden border border-white/60 dark:border-border/50"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <div className="rounded-2xl bg-stone-50 dark:bg-stone-900/50 p-4 border border-stone-100 dark:border-stone-800">
                  <Skeleton className="h-4 w-full mb-2 rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
