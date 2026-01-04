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

export async function getDashboardData() {
  const user = await getUser();
  const supabase = await createClientServer();

  if (!user) {
    return null;
  }

  // Fetch profile and stats in parallel
  const [profile, recentResultsResponse] = await Promise.all([
    getUserProfile(),
    supabase
      .from("images")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const { data: recentResults, count } = recentResultsResponse;

  return {
    user,
    profile,
    recentResults: recentResults || [],
    totalCount: count || 0,
    isPro: profile?.plan === "pro",
  };
}

export async function getUsageData(range: "weekly" | "monthly" | "yearly" = "weekly"): Promise<UsageData[]> {
  const user = await getUser();
  const supabase = await createClientServer();

  if (!user) {
    return [];
  }

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
    .eq("user_id", user.id)
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
