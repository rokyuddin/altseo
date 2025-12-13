'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/atoms/button'
import { UserMenu } from '@/components/molecules/user-menu'
import { Badge } from '@/components/atoms/badge'
import {
  LayoutDashboard,
  History,
  Settings,
  Upload,
  BarChart3,
  Image as ImageIcon,
  Zap,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  userEmail?: string
  userStats?: {
    totalUploads: number
    totalGenerations: number
    plan: string
  }
  onClose?: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and quick actions'
  },
  {
    name: 'Upload',
    href: '/dashboard/upload',
    icon: Upload,
    description: 'Upload new images'
  },
  {
    name: 'History',
    href: '/dashboard/history',
    icon: History,
    description: 'View your generated alt text'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Usage statistics'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account and preferences'
  }
]

export function Sidebar({ userEmail, userStats, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="pb-12 min-h-screen w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      {/* Logo and User Section */}
      <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">AltSEO</span>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
            <UserMenu userEmail={userEmail} />
          </div>
        </div>

        {/* User Stats */}
        {userStats && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Plan</span>
              <Badge variant={userStats.plan === 'pro' ? 'default' : 'secondary'} className="text-xs">
                {userStats.plan === 'pro' ? (
                  <><Zap className="w-3 h-3 mr-1" /> Pro</>
                ) : (
                  'Free'
                )}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{userStats.totalUploads}</div>
                <div className="text-zinc-600 dark:text-zinc-400">Uploads</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{userStats.totalGenerations}</div>
                <div className="text-zinc-600 dark:text-zinc-400">Generated</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <h3 className="mb-2 px-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-3",
                      isActive && "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    )}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Icon className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0",
                        isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                      )} />
                      <div className="flex-1 text-left">
                        <div className={cn(
                          "text-sm font-medium",
                          isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"
                        )}>
                          {item.name}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Need help? <Link href="/support" className="text-primary hover:underline">Contact support</Link>
        </div>
      </div>
    </div>
  )
}
