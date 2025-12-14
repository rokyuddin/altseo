import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/auth/get-user";
import { checkRateLimit } from "@/lib/rate-limit";
import { ImageUploader } from "@/features/upload/components/image-uploader";
import Link from "next/link";
import {
  Crown,
  Zap,
  AlertCircle,
  TrendingUp,
  Upload,
  CheckCircle,
  Leaf,
  Sparkles,
} from "lucide-react";

export default async function UploadPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect("/login");
  }

  const rateLimit = await checkRateLimit(user.id);
  const isPro = profile.plan === "pro";
  const isNearLimit = !isPro && rateLimit.remaining <= 3;
  const isAtLimit = !isPro && rateLimit.remaining === 0;

  return (
    <div className="px-6 py-12 space-y-8 relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide">
              Upload & Generate
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Upload Images
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Upload images and generate SEO-friendly alt text in seconds
          </p>
        </div>

        {/* Plan Badge */}
        <div className="flex items-center gap-2">
          {isPro ? (
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 px-6 py-3 text-sm font-semibold text-white shadow-lg">
              <Crown className="h-4 w-4" />
              Pro Plan
            </div>
          ) : (
            <Link
              href="/?scroll=pricing"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <TrendingUp className="h-4 w-4" />
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      {/* Usage Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Limit */}
        <div
          className={`bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
            isAtLimit
              ? "border-red-200 bg-red-50/50"
              : isNearLimit
                ? "border-orange-200 bg-orange-50/50"
                : "border-white/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] shadow-sm ${
                  isAtLimit
                    ? "bg-gradient-to-br from-red-100 to-red-200"
                    : isNearLimit
                      ? "bg-gradient-to-br from-orange-100 to-orange-200"
                      : isPro
                        ? "bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500"
                        : "bg-gradient-to-br from-blue-100 to-green-100"
                }`}
              >
                {isPro ? (
                  <Crown className="h-6 w-6 text-white" />
                ) : isAtLimit ? (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <Upload className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Daily Limit
                </p>
                <p className="text-xl font-bold text-foreground">
                  {isPro
                    ? "Unlimited"
                    : `${rateLimit.remaining}/${rateLimit.limit}`}
                </p>
              </div>
            </div>
          </div>
          {!isPro && (
            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAtLimit
                      ? "bg-red-500"
                      : isNearLimit
                        ? "bg-gradient-to-r from-orange-400 to-orange-500"
                        : "bg-gradient-to-r from-green-400 to-blue-400"
                  }`}
                  style={{
                    width: `${(rateLimit.remaining / rateLimit.limit) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Upload Type */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Upload Mode
              </p>
              <p className="text-xl font-bold text-foreground">
                {isPro ? "Bulk Upload" : "Single Upload"}
              </p>
            </div>
          </div>
        </div>

        {/* Processing Speed */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-green-100 to-emerald-100 shadow-sm">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Processing
              </p>
              <p className="text-xl font-bold text-foreground">
                {isPro ? "Priority" : "Standard"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* At Limit Warning */}
      {isAtLimit && (
        <div className="bg-red-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-red-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-red-100 to-red-200 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-red-900 mb-2">
                Daily Limit Reached
              </h3>
              <p className="text-sm text-red-800 leading-relaxed mb-4">
                You've reached your daily limit of {rateLimit.limit} images.
                Upgrade to Pro for unlimited uploads or wait until tomorrow.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 shadow-md hover:shadow-lg"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Near Limit Warning */}
      {isNearLimit && !isAtLimit && (
        <div className="bg-orange-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-orange-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-orange-900 mb-2">
                Running Low on Credits
              </h3>
              <p className="text-sm text-orange-800 leading-relaxed">
                You have {rateLimit.remaining} uploads remaining today. Consider
                upgrading to Pro for unlimited uploads.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Free Plan Info */}
      {!isPro && !isAtLimit && !isNearLimit && (
        <div className="bg-blue-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-blue-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-blue-100 to-green-100 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-foreground mb-2">
                Free Plan
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You're on the Free plan with {rateLimit.limit} daily uploads.
                Upgrade to Pro for unlimited uploads, bulk processing, and API
                access.
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}

      {/* Image Uploader Component */}
      <ImageUploader allowGuest={false} />

      {/* Pro Features Callout */}
      {!isPro && (
        <div className="bg-gradient-to-br from-green-50/80 via-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-[3rem] p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg flex-shrink-0">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Unlock Pro Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Unlimited daily uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Bulk upload support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Priority processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Full history access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">API key generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Advanced export options</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <TrendingUp className="h-5 w-5" />
                Upgrade to Pro Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
