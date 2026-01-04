"use client"

import { Plus, Settings, Key, HelpCircle, FileText, Share2 } from "lucide-react"
import Link from "next/link"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card"
import { Button } from "@/components/atoms/button"

const ACTIONS = [
  {
    label: "API Keys",
    icon: Key,
    href: "/api-keys",
    color: "bg-blue-500",
    description: "Manage credentials"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "bg-zinc-500",
    description: "App configuration"
  },
]

export function QuickActions() {
  return (
    <Card className="border-none">
      <CardHeader >
        <CardTitle>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>

        <div className="grid grid-cols-2 gap-6">
          {ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group p-4 rounded-3xl bg-secondary/30 hover:bg-white dark:hover:bg-card border border-transparent hover:border-white/60 dark:hover:border-border/50 transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <div className={`p-2 size-8 rounded-2xl ${action.color} text-white mb-3 shadow-lg shadow-${action.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                <action.icon className="size-4" />
              </div>
              <p className="font-bold text-sm mb-1">{action.label}</p>
              <p className="text-xs text-muted-foreground leading-tight">{action.description}</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
