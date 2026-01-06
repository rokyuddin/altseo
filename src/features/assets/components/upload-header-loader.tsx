import { Skeleton } from "@/components/atoms/skeleton";

export function UploadHeaderLoader() {
    return (
        <div className="space-y-8">
            {/* Header Info Loader */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-3 w-full max-w-lg">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-48 md:w-64 rounded-lg" />
                    <Skeleton className="h-6 w-full max-w-md rounded-md" />
                </div>
                <Skeleton className="h-12 w-40 rounded-full" />
            </div>

            {/* Stats Grid Loader */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCardLoader hasProgress />
                <StatCardLoader />
                <StatCardLoader />
            </div>
        </div>
    );
}

function StatCardLoader({ hasProgress }: { hasProgress?: boolean }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-4xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-[1.25rem] shrink-0" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                </div>
            </div>
            {hasProgress && (
                <div className="mt-4">
                    <Skeleton className="h-3 w-full rounded-full" />
                </div>
            )}
        </div>
    );
}
