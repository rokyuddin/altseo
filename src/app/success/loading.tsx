import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent } from "@/components/atoms/card";

export default function SuccessLoading() {
  return (
    <div className="relative flex justify-center items-center bg-background p-4 @md:p-6 min-h-screen overflow-hidden">
      {/* Background Elements to match SuccessPage */}
      <div className="top-0 left-0 -z-10 absolute w-full h-full overflow-hidden">
        <div className="top-[-10%] left-[-10%] absolute bg-primary/10 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow" />
        <div className="right-[-10%] bottom-[-10%] absolute bg-accent/10 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow duration-700" />
      </div>

      <div className="z-10 relative w-full max-w-xl">
        <Card className="bg-card/60 shadow-2xl backdrop-blur-xl border-border/40 rounded-[2.5rem] overflow-hidden">
          <CardContent className="px-6 @md:px-10 pt-12 pb-10 text-center">
            {/* Success Icon Skeleton */}
            <div className="inline-block relative mb-8">
              <Skeleton className="mx-auto rounded-full size-20 @md:size-24" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="mx-auto mb-4 w-3/4 h-10 @md:h-12" />

            {/* Description Skeleton */}
            <div className="space-y-2 mb-10">
              <Skeleton className="mx-auto w-1/2 h-4" />
              <Skeleton className="mx-auto w-1/3 h-4" />
            </div>

            {/* Order Details Skeleton */}
            <div className="space-y-4 bg-muted/30 mb-10 p-6 border border-border/40 rounded-3xl text-left">
              <Skeleton className="w-28 h-3" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-32 h-6" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-40 h-6" />
                </div>
                <div className="flex justify-between items-center pt-1 border-border/20 border-t">
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-24 h-6" />
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="gap-4 grid grid-cols-1 @sm:grid-cols-2">
              <Skeleton className="rounded-2xl w-full h-14" />
              <Skeleton className="rounded-2xl w-full h-14" />
            </div>
          </CardContent>
        </Card>

        {/* Bottom micro-copy Skeleton */}
        <div className="flex justify-center mt-8">
          <Skeleton className="w-48 h-4" />
        </div>
      </div>
    </div>
  );
}
