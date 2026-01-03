"use client"

import { TrendingUp, Zap } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/atoms/chart"

const chartData = [
  { type: "used", value: 12, fill: "oklch(0.55 0.12 130)" },
]

const chartConfig = {
  value: {
    label: "Generations",
  },
  used: {
    label: "Used",
    color: "oklch(0.55 0.12 130)",
  },
} satisfies ChartConfig

export function QuotaChart() {
  return (
    <Card className="flex flex-col bg-white/50 backdrop-blur-xl dark:bg-card/20 border-white/60 dark:border-border/30 rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-bold">Daily Quota</CardTitle>
        <CardDescription className="text-xs">Your AI usage today</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + (12 / 50) * 360}
            innerRadius={65}
            outerRadius={90}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted/20 last:fill-background"
              polarRadius={[70, 58]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          12/50
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-[10px] font-medium tracking-wider uppercase"
                        >
                          Used
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-0 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Zap className="h-3 w-3 fill-current" />
          Pro plan active
        </div>
      </CardFooter>
    </Card>
  )
}
