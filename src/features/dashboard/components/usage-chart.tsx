"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
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

const chartData = [
  { date: "2024-03-28", generations: 4 },
  { date: "2024-03-29", generations: 3 },
  { date: "2024-03-30", generations: 5 },
  { date: "2024-03-31", generations: 2 },
  { date: "2024-04-01", generations: 8 },
  { date: "2024-04-02", generations: 12 },
  { date: "2024-04-03", generations: 7 },
]

const chartConfig = {
  generations: {
    label: "Generations",
    color: "oklch(0.55 0.12 130)",
  },
} satisfies ChartConfig

export function UsageChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("generations")

  const total = React.useMemo(
    () => ({
      generations: chartData.reduce((acc, curr) => acc + curr.generations, 0),
    }),
    []
  )

  return (
    <Card className="bg-white/50 backdrop-blur-xl border-white/60 dark:bg-card/20 dark:border-border/30 rounded-4xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-xl font-bold">Activity Overview</CardTitle>
          <CardDescription className="text-sm font-light">
            Your image generation activity for the last 7 days.
          </CardDescription>
        </div>
        <div className="flex">
          <div
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
              Total Generations
            </span>
            <span className="text-2xl leading-none font-bold sm:text-3xl text-primary">
              {total.generations.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
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
                return date.toLocaleDateString("en-US", {
                  weekday: "short",
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
