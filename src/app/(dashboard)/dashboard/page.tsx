import type { Metadata } from 'next'
import { DashboardStats, DashboardStatsLoader, QuickActions, QuotaChart, RecentResults, RecentResultsLoader } from "@/features/dashboard";

export const metadata: Metadata = {
  title: 'Dashboard | AltSEO - Image SEO Overview',
  description: 'View your image SEO analytics and accessibility metrics at a glance.',
}
import { Sparkles } from "lucide-react";
import { Suspense } from "react";


export default function DashboardPage() {
  return (
    <div className="container-inline-size space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="group flex items-center gap-2.5 text-primary">
          <div className="bg-primary/10 group-hover:bg-primary/20 shadow-inner p-2 rounded-xl transition-all duration-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-primary/80 text-xs uppercase tracking-[0.2em]">
            Overview & Analytics
          </span>
        </div>
        <h1 className="font-black text-foreground text-4xl md:text-7xl tracking-tightest">
          Dashboard<span className="text-primary text-8xl leading-0">.</span>
        </h1>
      </div>
      <Suspense fallback={<DashboardStatsLoader />}>
        <DashboardStats />
      </Suspense>

      {/* Main Bento Grid */}
      <div className="gap-8 grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-12 md:col-span-8">
          <Suspense fallback={<RecentResultsLoader />}>
            <RecentResults />
          </Suspense>
        </div>
        <div className="space-y-6 col-span-12 md:col-span-4">
          <QuotaChart />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
