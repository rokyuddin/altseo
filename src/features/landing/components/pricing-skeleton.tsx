import { Card, CardContent, CardHeader } from "@/components/atoms/card";

export function PricingSkeleton() {
    return (
        <section className="py-32 px-6 relative container-inline-size">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <div className="h-8 w-40 bg-muted animate-pulse rounded-full mx-auto" />
                    <div className="h-16 w-3/4 max-w-2xl bg-muted animate-pulse rounded-2xl mx-auto" />
                    <div className="h-6 w-1/2 max-w-lg bg-muted animate-pulse rounded-xl mx-auto" />
                </div>

                <div className="grid @md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                    {[1, 2].map((i) => (
                        <Card key={i} className="bg-card/80 backdrop-blur-sm border border-border h-[500px]">
                            <CardHeader className="text-center pb-6 pt-8 space-y-4">
                                <div className="size-16 bg-muted animate-pulse rounded-full mx-auto" />
                                <div className="h-8 w-24 bg-muted animate-pulse rounded-lg mx-auto" />
                                <div className="h-10 w-32 bg-muted animate-pulse rounded-lg mx-auto" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((j) => (
                                        <div key={j} className="h-4 w-full bg-muted animate-pulse rounded" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
