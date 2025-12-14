import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user";
import Link from "next/link";
import { format } from "date-fns";
import {
  Leaf,
  Crown,
  Sparkles,
  TrendingUp,
  Calendar,
  Upload as UploadIcon,
  ImageIcon,
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();

  // const rateLimit = await checkRateLimit(user.id);

  // Get recent results
  const { data: recentResults } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const isPro = profile?.plan === "pro";

  return (
    <div className="px-6 py-12 space-y-8 relative z-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Leaf className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">
            Your Overview
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground font-light">
          Welcome back! Upload images to generate alt text.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Plan Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            {isPro ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg">
                <Crown className="h-7 w-7 text-white" />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-green-100 to-blue-100 shadow-sm">
                <Sparkles className="h-7 w-7 text-green-600" />
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Plan
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {isPro ? "Pro" : "Free"}
          </p>
          {!isPro && (
            <Link
              href="/?scroll=pricing"
              className="inline-flex items-center gap-2 mt-4 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Crown className="h-3 w-3" />
              Upgrade to Pro
            </Link>
          )}
        </div>

        {/* Daily Usage Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm">
              <TrendingUp className="h-7 w-7 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Daily Usage
          </h3>
          {/* <p className="text-3xl font-bold text-foreground">
              {rateLimit.remaining} / {rateLimit.limit === 999999 ? "∞" : rateLimit.limit}
            </p> */}
          <p className="text-3xl font-bold text-foreground">-</p>
        </div>

        {/* Total Results Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-green-100 to-emerald-100 shadow-sm">
              <ImageIcon className="h-7 w-7 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Results
          </h3>
          <p className="text-3xl font-bold text-foreground">
            {recentResults?.length || 0}
          </p>
        </div>
      </div>

      {/* Recent Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br from-stone-100 to-stone-200">
              <Calendar className="h-5 w-5 text-stone-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Recent Results
            </h2>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary/80 px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <UploadIcon className="h-4 w-4" />
            Upload Images
          </Link>
        </div>

        {recentResults && recentResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentResults.map((result) => (
              <div
                key={result.id}
                className="group bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br from-green-100 to-blue-100 flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {result.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(result.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  {result.alt_text && (
                    <div className="rounded-[1rem] bg-gradient-to-br from-stone-50 to-green-50/30 p-4 border border-stone-100">
                      <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                        {result.alt_text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-stone-100 to-stone-200 mb-6">
              <ImageIcon className="h-10 w-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No results yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              No results yet. Upload your first image to get started!
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <UploadIcon className="h-5 w-5" />
              Upload Images
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
