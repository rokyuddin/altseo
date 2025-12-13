import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </div>
        {description && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-xs font-medium",
              trend.value > 0
                ? "text-green-600 dark:text-green-400"
                : trend.value < 0
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-600 dark:text-zinc-400"
            )}>
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
