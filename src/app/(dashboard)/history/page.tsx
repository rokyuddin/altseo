import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import Link from "next/link";
import {
  Download,
  Image as ImageIcon,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  Leaf,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default async function HistoryPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect("/login");
  }

  const supabase = await createClient();
  const isPro = profile.plan === "pro";

  // Free users: last 10, Pro: all
  const limit = isPro ? undefined : 10;
  const query = supabase
    .from("images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit) {
    query.limit(limit);
  }

  const { data: results } = await query;

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from("images").getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="px-6 py-12 space-y-8 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">
                Your Collection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              History
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              {isPro
                ? "View all your generated alt text results"
                : "View your last 10 results"}
            </p>
          </div>
          {!isPro && results && results.length > 0 && (
            <Link
              href="/?scroll=pricing"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <TrendingUp className="h-4 w-4" />
              Upgrade for Full History
            </Link>
          )}
        </div>

        {/* Plan Info Banner */}
        {!isPro && (
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-blue-100 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Free Plan Limitation
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  You can only view your last 10 results. Upgrade to Pro to
                  access your complete history and unlock unlimited storage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-blue-100 to-green-100">
                    <ImageIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Total Images
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-green-100 to-emerald-100">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      With Alt Text
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.filter((r) => r.alt_text).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-purple-100 to-pink-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Latest Upload
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {format(new Date(results[0].created_at), "MMM d")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex gap-6">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative h-28 w-28 overflow-hidden rounded-[1.5rem] bg-stone-100 shadow-sm">
                        <img
                          src={getImageUrl(result.storage_path)}
                          alt={result.alt_text || result.file_name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground text-lg truncate mb-2">
                            {result.file_name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(
                                new Date(result.created_at),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                            </span>
                            {result.file_size && (
                              <span className="hidden sm:inline">
                                {formatFileSize(result.file_size)}
                              </span>
                            )}
                            {result.width && result.height && (
                              <span className="hidden sm:inline">
                                {result.width} × {result.height}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Download Button */}
                        {result.alt_text && (
                          <a
                            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                              result.alt_text
                            )}`}
                            download={`${result.file_name.replace(
                              /\.[^/.]+$/,
                              ""
                            )}-alt-text.txt`}
                            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        )}
                      </div>

                      {/* Alt Text */}
                      {result.alt_text ? (
                        <div className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-stone-50 to-green-50/30 p-5 border border-stone-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-green-600" />
                            <p className="text-sm font-semibold text-foreground">
                              Alt Text:
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {result.alt_text}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-[1.5rem] border-2 border-dashed border-stone-200 bg-stone-50/50 p-5">
                          <p className="text-sm text-muted-foreground italic">
                            No alt text generated yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-stone-100 to-stone-200 mb-6">
              <ImageIcon className="h-10 w-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No history yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Upload your first image to generate alt text and see it here!
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <ImageIcon className="h-5 w-5" />
              Upload Images
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
