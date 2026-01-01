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
import { UploadHeader } from "@/features/upload/components/upload-header";

export const dynamic = 'force-dynamic';

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
      <UploadHeader
        isPro={isPro}
        rateLimit={rateLimit}
        isNearLimit={isNearLimit}
        isAtLimit={isAtLimit}
      />

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
