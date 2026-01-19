
import { Crown, Sparkles, TrendingUp, ImageIcon } from "lucide-react";
import { StatsCard } from "./stats-card";
import { getUser } from "@/lib/auth";
import { isProUser } from "@/lib/subscription";
import { createAdminClient } from "@/lib/supabase/admin";


export async function DashboardStats() {
  const supabase = createAdminClient()
  const user = await getUser()
  const isPro = await isProUser(user?.id || "")



  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
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
        className="group relative overflow-hidden"
      >
        <div className="-top-4 -right-4 absolute bg-primary/5 group-hover:bg-primary/10 blur-2xl rounded-full w-24 h-24 transition-colors duration-500" />
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
        value={"0"}
        icon={ImageIcon}
        iconClassName="text-emerald-600 dark:text-emerald-400"
        iconContainerClassName="bg-emerald-100/50 dark:bg-emerald-900/20"
        description="All-time processed images"
      />
    </div>
  );
}
