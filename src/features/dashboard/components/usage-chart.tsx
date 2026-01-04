"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/atoms/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select"
import { useRouter, useSearchParams } from "next/navigation"
import { UsageData } from "../actions/dashboard-actions"

const chartConfig = {
  generations: {
    label: "Generations",
    color: "oklch(0.55 0.12 130)",
  },
} satisfies ChartConfig

interface UsageChartProps {
  initialData: UsageData[];
}

export function UsageChart({ initialData }: UsageChartProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const range = searchParams.get("range") as "weekly" | "monthly" | "yearly" || "weekly"

  const total = React.useMemo(
    () => ({
      generations: initialData.reduce((acc, curr) => acc + curr.generations, 0),
    }),
    [initialData]
  )

  const handleRangeChange = async (newRange: "weekly" | "monthly" | "yearly") => {
    router.push(`?range=${newRange}`)
  }

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-xl font-bold">Activity Overview</CardTitle>
          <CardDescription className="text-sm font-light">
            {range === "weekly" ? "Your image generation activity for the last 7 days." :
              range === "monthly" ? "Your image generation activity for the last 30 days." :
                "Your image generation activity for the last 12 months."}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 px-6 sm:px-8">
          <Select value={range} onValueChange={(v) => handleRangeChange(v as any)}>
            <SelectTrigger className="w-[120px] h-9 bg-primary/5 border-none font-medium text-xs">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <div
            className="relative z-30 flex flex-col justify-center gap-1 py-4 text-left sm:py-6"
          >
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
              Total
            </span>
            <span className="text-2xl leading-none font-bold sm:text-3xl text-primary">
              {total.generations.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 pt-6 relative">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={initialData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="oklch(0.9 0.02 130)" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                if (range === "yearly") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  })
                }
                return date.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                })
              }}
              className="text-[10px] font-medium text-muted-foreground"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border-white/50"
                  nameKey="generations"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar
              dataKey="generations"
              fill="oklch(0.55 0.12 130)"
              radius={[6, 6, 0, 0]}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
