import { Skeleton } from "@/components/atoms/skeleton"

export function DashboardStatsLoader() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <DashboardStatsCardLoader key={index} />
                ))
            }
        </div>
    )
}


function DashboardStatsCardLoader() {
    return (
        <div className="bg-white/80 backdrop-blur-sm dark:bg-card/30 rounded-4xl overflow-hidden border border-white/60 dark:border-border/50">
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
    )
}
