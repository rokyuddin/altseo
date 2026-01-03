"use client"

import { Plus, Settings, Key, HelpCircle, FileText, Share2 } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/atoms/card"

const ACTIONS = [
  {
    label: "Generate Alt",
    icon: Plus,
    href: "/upload",
    color: "bg-emerald-500",
    description: "Upload new images"
  },
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
  {
    label: "Documentation",
    icon: FileText,
    href: "#",
    color: "bg-orange-500",
    description: "Read the guides"
  }
]

export function QuickActions() {
  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl dark:bg-card/20 border-white/60 dark:border-border/30 rounded-4xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group p-4 rounded-3xl bg-secondary/30 hover:bg-white dark:hover:bg-card border border-transparent hover:border-white/60 dark:hover:border-border/50 transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <div className={`p-2 w-10 h-10 rounded-2xl ${action.color} text-white mb-3 shadow-lg shadow-${action.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm mb-1">{action.label}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{action.description}</p>
          </Link>
        ))}
      </div>
      <button className="w-full mt-6 py-3 rounded-2xl bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all flex items-center justify-center gap-2 group">
        <Share2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
        Share Results
      </button>
    </Card>
  )
}
