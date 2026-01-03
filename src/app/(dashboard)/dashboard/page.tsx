
import { redirect } from "next/navigation";
import { Leaf, Sparkles } from "lucide-react";
import { DashboardStats } from "@/features/dashboard";
import { RecentResults } from "@/features/dashboard";
import { UsageChart } from "@/features/dashboard/components/usage-chart";
import { QuotaChart } from "@/features/dashboard/components/quota-chart";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { getDashboardData } from "@/features/dashboard/actions/dashboard-actions";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  const { isPro, totalCount, recentResults } = data;

  return (
    <div className="px-4 py-8 md:px-8 md:py-12 space-y-12 relative z-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-primary group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">
              Overview & Analytics
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tightest">
            Dashboard<span className="text-primary text-8xl leading-0">.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light max-w-2xl leading-relaxed">
            Welcome back! You've processed <span className="text-foreground font-bold">{totalCount}</span> images so far. Keep building accessible experiences.
          </p>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Stats & Quota */}
        <div className="lg:col-span-3 space-y-8 flex flex-col">
          <DashboardStats isPro={isPro} totalResults={totalCount} />
          <QuotaChart />
        </div>

        {/* Center/Right Column - Activity & Actions */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <UsageChart />
          </div>
          <div className="md:col-span-1">
             <QuickActions />
          </div>
        </div>
      </div>

      <div className="pt-8">
        <RecentResults results={recentResults} />
      </div>
    </div>
  );
}
