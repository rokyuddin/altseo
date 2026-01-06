import { createAdminClient } from "@/lib/supabase/admin";
import { createClientServer } from "@/lib/supabase/server";
import { getUser, getUserProfile } from "@/lib/auth";

export type DashboardData = {
  profile: Awaited<ReturnType<typeof getUserProfile>>;
  recentResults: any[]; // refine type if possible
  totalCount: number;
  isPro: boolean;
};

export type UsageData = {
  date: string;
  generations: number;
};

async function getCachedDashboardContent(userId: string) {
  "use cache"
  const supabase = createAdminClient();

  // Fetch recent results and count with admin client to bypass RLS (safe with userId filter)
  const { data: recentResults, count, error } = await supabase
    .from("images")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching dashboard content:", error);
    return { recentResults: [], count: 0 };
  }

  return { recentResults: recentResults || [], count: count || 0 };
}

export async function getDashboardData() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  // Fetch profile and stats in parallel
  // getUserProfile uses cookies, so it stays here. 
  // We offset the DB query to the cached function.
  const [profile, content] = await Promise.all([
    getUserProfile(),
    getCachedDashboardContent(user.id),
  ]);

  return {
    user,
    profile,
    recentResults: content.recentResults,
    totalCount: content.count,
    isPro: profile?.plan === "pro",
  };
}

async function getCachedUsageData(userId: string, range: "weekly" | "monthly" | "yearly"): Promise<UsageData[]> {
  "use cache"
  const supabase = createAdminClient();

  let startDate = new Date();
  if (range === "weekly") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (range === "monthly") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const { data, error } = await supabase
    .from("images")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  // Aggregate data by date
  const counts: Record<string, number> = {};

  data.forEach((row) => {
    const date = new Date(row.created_at);
    let key: string;

    if (range === "yearly") {
      // Group by month
      key = date.toISOString().slice(0, 7); // YYYY-MM
    } else {
      // Group by day
      key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    }

    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts).map(([date, generations]) => ({
    date,
    generations,
  }));
}

export async function getUsageData(range: "weekly" | "monthly" | "yearly" = "weekly"): Promise<UsageData[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  return getCachedUsageData(user.id, range);
}
