"use client";

import { Users, Image as ImageIcon, CreditCard, Activity } from "lucide-react";
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
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

interface StatsGridProps {
  metrics: {
    totalUsers: number;
    totalImages: number;
    activeSubscriptions: number;
    lastActivity: string | null;
  };
}

export function StatsGrid({ metrics }: StatsGridProps) {
  const stats = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      description: "Registered accounts",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Images",
      value: metrics.totalImages,
      description: "Generated ALT texts",
      icon: ImageIcon,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      description: "Pro plan members",
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Last Activity",
      value: metrics.lastActivity
        ? format(new Date(metrics.lastActivity), "MMM d, HH:mm")
        : "N/A",
      description: "Latest system event",
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

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
    <Card className="col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Usage Analytics</CardTitle>
        <CardDescription>
          Number of images processed daily over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
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
                className="text-[10px] font-medium text-muted-foreground"
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
