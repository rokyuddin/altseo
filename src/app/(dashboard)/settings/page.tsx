import type { Metadata } from 'next'
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Settings | AltSEO - Manage Your Preferences',
  description: 'Manage your AltSEO account settings, subscription plans, and API configurations.',
}
import { getUser, getUserProfile } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClientServer } from "@/lib/supabase/server";
import Link from "next/link";
import { Crown, Key, TrendingUp, User, Shield, Zap, Leaf } from "lucide-react";
import { signOut } from "@/features/auth/actions/auth-actions";



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

  const supabase = await createClientServer();
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
    <div className="z-10 relative space-y-8 px-6 py-12">
      <div className="z-10 relative space-y-8 mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="w-5 h-5" />
            <span className="font-medium text-sm tracking-wide">
              Your Garden
            </span>
          </div>
          <h1 className="font-bold text-foreground text-4xl md:text-5xl tracking-tight">
            Settings
          </h1>
          <p className="font-light text-muted-foreground text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Plan Card */}
          <div className="bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm p-8 border border-white/60 rounded-4xl transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {isPro ? (
                  <div className="flex justify-center items-center bg-linear-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg rounded-3xl w-16 h-16">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="flex justify-center items-center bg-linear-to-br from-green-100 to-blue-100 rounded-3xl w-16 h-16">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                )}
                <div>
                  <h2 className="mb-1 font-bold text-foreground text-2xl">
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
                  className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-blue-600 shadow-lg hover:shadow-xl px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  Upgrade to Pro
                </Link>
              )}
            </div>

            {!isPro && (
              <div className="bg-linear-to-br from-green-50 to-blue-50 mt-6 p-6 border border-green-100/50 rounded-3xl">
                <h3 className="mb-3 font-semibold text-foreground text-sm">
                  Unlock Pro Features:
                </h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-1.5 h-1.5" />
                    Unlimited image uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-1.5 h-1.5" />
                    Bulk upload support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-1.5 h-1.5" />
                    API access for automation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-1.5 h-1.5" />
                    Full history access
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-green-500 rounded-full w-1.5 h-1.5" />
                    Priority processing
                  </li>
                </ul>
              </div>
            )}

            {isPro && subscription && (
              <div className="flex items-center gap-2 mt-4 text-muted-foreground text-sm">
                <Shield className="w-4 h-4" />
                <span>
                  Member since{" "}
                  {new Date(subscription.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm p-8 border border-white/60 rounded-4xl transition-all duration-500">
            <h2 className="mb-6 font-bold text-foreground text-xl">
              Usage Statistics
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="font-medium text-muted-foreground">
                    Daily Image Limit:
                  </span>
                  <span className="font-semibold text-foreground">
                    {isPro ? "Unlimited" : `${rateLimit.limit} images`}
                  </span>
                </div>
                {!isPro && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Remaining Today:
                      </span>
                      <span className="font-bold text-green-600">
                        {rateLimit.remaining} / {rateLimit.limit}
                      </span>
                    </div>
                    <div className="bg-stone-100 rounded-full w-full h-3 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-green-400 to-blue-400 rounded-full h-full transition-all duration-500"
                        style={{
                          width: `${(rateLimit.remaining / rateLimit.limit) * 100
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
            <div className="bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm p-8 border border-white/60 rounded-4xl transition-all duration-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex justify-center items-center bg-linear-to-br from-blue-100 to-green-100 rounded-[1.25rem] w-14 h-14">
                    <Key className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-xl">
                      API Keys
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {apiKeysCount === 0
                        ? "No API keys created yet"
                        : `${apiKeysCount} active ${apiKeysCount === 1 ? "key" : "keys"
                        }`}
                    </p>
                  </div>
                </div>
                <Link
                  href="/api-keys"
                  className="bg-foreground hover:bg-foreground/90 shadow-lg hover:shadow-xl px-6 py-3 rounded-full font-semibold text-background text-sm transition-all hover:-translate-y-0.5"
                >
                  Manage Keys
                </Link>
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                Generate API keys for programmatic access to alt text
                generation.
              </p>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm p-8 border border-white/60 rounded-4xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex justify-center items-center bg-linear-to-br from-stone-100 to-stone-200 rounded-[1.25rem] w-14 h-14">
                <User className="w-6 h-6 text-stone-600" />
              </div>
              <h2 className="font-bold text-foreground text-xl">
                Account Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-stone-100 border-b text-sm">
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
                <span className="font-semibold text-foreground">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between py-3 border-stone-100 border-b text-sm">
                <span className="font-medium text-muted-foreground">
                  User ID:
                </span>
                <span className="font-mono text-muted-foreground text-xs">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              {subscription && (
                <div className="flex justify-between py-3 text-sm">
                  <span className="font-medium text-muted-foreground">
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
          <div className="bg-red-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm p-8 border border-red-100 rounded-4xl">
            <h2 className="mb-2 font-bold text-red-900 text-xl">Danger Zone</h2>
            <p className="mb-6 text-red-800 text-sm">
              Once you sign out, you'll need to log in again to access your
              account.
            </p>
            <form action={async () => {
              await signOut();
            }}>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl px-6 py-3 rounded-full font-semibold text-white text-sm transition-all"
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
