import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/auth/get-user";
import { checkRateLimit } from "@/lib/rate-limit";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Crown, Key, TrendingUp, User, Shield, Zap, Leaf } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect("/login");
  }

  const rateLimit = await checkRateLimit(user.id);

  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const isPro = profile.plan === "pro";

  // Get API keys count for Pro users
  let apiKeysCount = 0;
  if (isPro) {
    const { count } = await supabase
      .from("api_keys")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("revoked_at", null);
    apiKeysCount = count || 0;
  }

  return (
    <div className="px-6 py-12 space-y-8 relative z-10">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide">
              Your Garden
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Plan Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {isPro ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-green-100 to-blue-100">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {isPro ? "Pro Plan" : "Free Plan"}
                  </h2>
                  <p className="text-muted-foreground">
                    {isPro
                      ? "Unlimited images and API access"
                      : "10 images per day"}
                  </p>
                </div>
              </div>
              {!isPro && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <TrendingUp className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
              )}
            </div>

            {!isPro && (
              <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-green-50 to-blue-50 p-6 border border-green-100/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Unlock Pro Features:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Unlimited image uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Bulk upload support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    API access for automation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Full history access
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Priority processing
                  </li>
                </ul>
              </div>
            )}

            {isPro && subscription && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>
                  Member since{" "}
                  {new Date(subscription.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Usage Statistics
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground font-medium">
                    Daily Image Limit:
                  </span>
                  <span className="font-semibold text-foreground">
                    {isPro ? "Unlimited" : `${rateLimit.limit} images`}
                  </span>
                </div>
                {!isPro && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Remaining Today:
                      </span>
                      <span className="font-bold text-green-600">
                        {rateLimit.remaining} / {rateLimit.limit}
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
                        style={{
                          width: `${
                            (rateLimit.remaining / rateLimit.limit) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* API Keys Section (Pro Only) */}
          {isPro && (
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-100 to-green-100">
                    <Key className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      API Keys
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {apiKeysCount === 0
                        ? "No API keys created yet"
                        : `${apiKeysCount} active ${
                            apiKeysCount === 1 ? "key" : "keys"
                          }`}
                    </p>
                  </div>
                </div>
                <Link
                  href="/api-keys"
                  className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Manage Keys
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Generate API keys for programmatic access to alt text
                generation.
              </p>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-stone-100 to-stone-200">
                <User className="h-6 w-6 text-stone-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Account Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm py-3 border-b border-stone-100">
                <span className="text-muted-foreground font-medium">
                  Email:
                </span>
                <span className="font-semibold text-foreground">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between text-sm py-3 border-b border-stone-100">
                <span className="text-muted-foreground font-medium">
                  User ID:
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              {subscription && (
                <div className="flex justify-between text-sm py-3">
                  <span className="text-muted-foreground font-medium">
                    Member since:
                  </span>
                  <span className="font-semibold text-foreground">
                    {new Date(subscription.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100">
            <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-800 mb-6">
              Once you sign out, you'll need to log in again to access your
              account.
            </p>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 shadow-lg hover:shadow-xl"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
