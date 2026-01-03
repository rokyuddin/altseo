
import Link from "next/link";
import { Crown, Sparkles, TrendingUp, ImageIcon } from "lucide-react";
import { StatsCard } from "./stats-card";

interface DashboardStatsProps {
  isPro: boolean;
  totalResults: number;
}

export function DashboardStats({ isPro, totalResults }: DashboardStatsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Plan Card */}
      <StatsCard
        title="Active Plan"
        value={isPro ? "Pro Member" : "Free Plan"}
        icon={isPro ? Crown : Sparkles}
        iconClassName={isPro ? "text-white" : "text-primary"}
        iconContainerClassName={
          isPro
            ? "bg-linear-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg shadow-orange-500/20"
            : "bg-primary/10"
        }
        className="relative overflow-hidden group"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
        {!isPro && (
          <Link
            href="/?scroll=pricing"
            className="inline-flex items-center justify-center gap-2 mt-6 w-full rounded-2xl bg-linear-to-r from-primary to-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
          >
            <Crown className="h-4 w-4" />
            Upgrade Now
          </Link>
        )}
      </StatsCard>

      {/* Daily Usage Card */}
      <StatsCard
        title="Daily Generations"
        value="12 / 50"
        icon={TrendingUp}
        iconClassName="text-blue-600 dark:text-blue-400"
        iconContainerClassName="bg-blue-100/50 dark:bg-blue-900/20"
        description="Renewing in 12 hours"
      />

      {/* Total Results Card */}
      <StatsCard
        title="Lifetime Results"
        value={totalResults}
        icon={ImageIcon}
        iconClassName="text-emerald-600 dark:text-emerald-400"
        iconContainerClassName="bg-emerald-100/50 dark:bg-emerald-900/20"
        description="All-time processed images"
      />
    </div>
  );
}
