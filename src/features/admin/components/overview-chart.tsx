
"use client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/atoms/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/atoms/chart";
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/atoms/skeleton";


interface OverviewChartProps {
    data: { date: string; count: number }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
    const chartConfig = {
        count: {
            label: "Images",
            color: "hsl(var(--primary))",
        },
    };

    return (
        <Card className="col-span-4 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                    Number of images processed daily over the last 30 days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-full">
                    <ChartContainer config={chartConfig}>
                        <BarChart data={data}>
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-muted/30"
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => format(new Date(value), "MMM d")}
                                className="font-medium text-[10px] text-muted-foreground"
                            />
                            <YAxis hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}


export function OverviewChartSkeleton() {
    return (
        <Card className="col-span-4 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-64 h-4" />
            </CardHeader>
            <CardContent>
                <div className="w-full h-full">
                    <Skeleton className="w-full h-full" />
                </div>
            </CardContent>
        </Card>
    );
}
