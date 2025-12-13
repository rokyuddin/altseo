import { StatsCard } from '@/components/molecules/stats-card'
import { Image, FileText, TrendingUp, Clock } from 'lucide-react'

interface StatsGridProps {
  stats: {
    totalUploads: number
    totalGenerations: number
    monthlyUploads: number
    successRate: number
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statsData = [
    {
      title: "Total Uploads",
      value: stats.totalUploads,
      description: "Images uploaded",
      icon: Image,
      trend: stats.monthlyUploads > 0 ? {
        value: Math.round((stats.monthlyUploads / Math.max(stats.totalUploads - stats.monthlyUploads, 1)) * 100),
        label: "from last month"
      } : undefined
    },
    {
      title: "Alt Text Generated",
      value: stats.totalGenerations,
      description: "SEO-friendly descriptions",
      icon: FileText,
      trend: stats.totalUploads > 0 ? {
        value: Math.round((stats.totalGenerations / stats.totalUploads) * 100),
        label: "success rate"
      } : undefined
    },
    {
      title: "This Month",
      value: stats.monthlyUploads,
      description: "Uploads this month",
      icon: TrendingUp,
      trend: stats.monthlyUploads > 0 ? {
        value: stats.monthlyUploads,
        label: "new uploads"
      } : undefined
    },
    {
      title: "Avg. Processing Time",
      value: "~2.3s",
      description: "Per image generation",
      icon: Clock
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}
