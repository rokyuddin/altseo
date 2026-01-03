import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import Link from "next/link";
import {
  Image as ImageIcon,
  Clock,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { HistoryResults } from "./history-results";

interface HistoryListProps {
  userId: string;
  isPro: boolean;
}

export async function HistoryList({ userId, isPro }: HistoryListProps) {
  const supabase = await createClient();

  // Free users: last 10, Pro: all
  const limit = isPro ? undefined : 10;
  const query = supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (limit) {
    query.limit(limit);
  }

  const { data: results } = await query;

  return (
    <div className="space-y-8 relative z-10 w-full max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 backdrop-blur-xl p-8 rounded-4xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">Your Gallery</h3>
            <p className="text-sm text-muted-foreground font-medium">
              {isPro
                ? "View all your generated alt text results"
                : "View your last 10 results"}
            </p>
          </div>
        </div>

        {!isPro && results && results.length > 0 && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-green-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <TrendingUp className="h-4 w-4" />
            Upgrade for Full History
          </Link>
        )}
      </div>

      {/* Plan Info Banner */}
      {!isPro && (
        <div className="bg-blue-50/80 backdrop-blur-sm rounded-4xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
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
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md rounded-4xl p-6 shadow-sm border border-white/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100/50">
                  <ImageIcon className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                    Total Images
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    {results.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-4xl p-6 shadow-sm border border-white/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100/50">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                    With Alt Text
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    {results.filter((r) => r.alt_text).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-4xl p-6 shadow-sm border border-white/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100/50">
                  <Clock className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                    Latest Upload
                  </p>
                  <p className="text-xl font-black text-foreground">
                    {format(new Date(results[0].created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <HistoryResults initialResults={results} />
        </div>
      ) : (
        <div className="bg-white/40 backdrop-blur-xl rounded-4xl p-20 text-center border border-white/60 shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-4xl bg-stone-100 mb-8 shadow-inner">
            <ImageIcon className="h-12 w-12 text-stone-300" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4">No history yet</h3>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
            Upload your first image to generate alt text and see it here!
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-5 text-lg font-bold text-background transition-all hover:bg-foreground/90 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <ImageIcon className="h-6 w-6" />
            Upload Images
          </Link>
        </div>
      )}
    </div>
  );
}
