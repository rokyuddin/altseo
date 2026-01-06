import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

export function ApiKeysListLoader() {
    return (
        <Card>
            <CardHeader className="space-y-4">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-[80%] h-8" />
                <Skeleton className="w-[60%] h-8" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
            </CardContent>
        </Card>

    )
}
