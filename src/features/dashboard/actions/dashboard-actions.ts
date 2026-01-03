'use server';

import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user";

export type DashboardData = {
  profile: Awaited<ReturnType<typeof getUserProfile>>;
  recentResults: any[]; // refine type if possible
  totalCount: number;
  isPro: boolean;
};

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
