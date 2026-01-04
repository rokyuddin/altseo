
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";

export function RecentResultsLoader() {
    return (
        <Card className="h-[calc(100svh-37rem)] flex flex-col gap-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <Skeleton className="h-10 w-36 rounded-2xl" />
                    <Skeleton className="h-10 w-36 rounded-2xl" />
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden space-y-6 pt-6">
                {
                    Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-[4.2rem] w-full rounded-2xl" />
                    ))
                }
            </CardContent>
            <Separator />
            <CardFooter className="py-4 justify-center">
                <Skeleton className="h-4 w-24 rounded-full" />
            </CardFooter>
        </Card>
    );
}
