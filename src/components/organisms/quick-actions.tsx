import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { Upload, History, Settings, BarChart3, Zap, FileImage } from 'lucide-react'

const quickActions = [
  {
    title: "Upload Images",
    description: "Generate alt text for new images",
    icon: Upload,
    href: "/dashboard",
    variant: "default" as const,
    primary: true
  },
  {
    title: "View History",
    description: "Browse your previous uploads",
    icon: History,
    href: "/dashboard/history",
    variant: "outline" as const
  },
  {
    title: "Analytics",
    description: "View usage statistics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    variant: "outline" as const
  },
  {
    title: "Settings",
    description: "Manage your account",
    icon: Settings,
    href: "/dashboard/settings",
    variant: "outline" as const
  }
]

export function QuickActions() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Common tasks to help you get started
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon

          return (
            <Card key={index} className={action.primary ? "border-primary/50 bg-primary/5" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    action.primary
                      ? "bg-primary text-primary-foreground"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {action.description}
                </CardDescription>
                <Link href={action.href}>
                  <Button
                    variant={action.variant}
                    className="w-full"
                    size="sm"
                  >
                    {action.primary ? (
                      <>
                        <FileImage className="mr-2 h-4 w-4" />
                        Get Started
                      </>
                    ) : (
                      "View"
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
