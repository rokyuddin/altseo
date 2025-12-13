'use client'

import { useState, useEffect } from 'react'
import { UserMenu } from '@/components/molecules/user-menu'
import { Button } from '@/components/atoms/button'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Image as ImageIcon, Sparkles, LayoutDashboard, History, Settings } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DashboardShellProps {
  children: React.ReactNode
  userEmail?: string
}

export default function DashboardShell({ children, userEmail }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Organic background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-white/20 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <ImageIcon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-lg">AltSEO</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:flex">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
              <UserMenu userEmail={userEmail} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-r border-white/20 dark:border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-lg">AltSEO</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start rounded-xl h-12">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/history" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start rounded-xl h-12">
                <History className="w-5 h-5 mr-3" />
                History
              </Button>
            </Link>
            <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start rounded-xl h-12">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
