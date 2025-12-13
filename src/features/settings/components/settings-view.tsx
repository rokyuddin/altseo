"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Loader2,
  Key,
  Copy,
  Check,
  Trash2,
  Plus,
  Sparkles,
  Crown,
  Leaf,
  Zap,
  Shield,
  AlertCircle,
  TrendingUp,
  Calendar,
  Settings,
} from "lucide-react";
import { generateApiKey, revokeApiKey } from "../actions/settings-actions";
import { getRateLimitStatus } from "@/lib/rate-limit";

interface ApiKey {
  id: string;
  name: string | null;
  last_used_at: string | null;
  created_at: string;
}

export function SettingsView() {
  const [subscription, setSubscription] = useState<{
    plan_type: string;
  } | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [rateLimit, setRateLimit] = useState<{
    count: number;
    limit: number;
    remaining: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Load subscription
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("plan_type")
        .eq("user_id", user.id)
        .single();
      setSubscription(subData);

      // Load API keys (Pro users only)
      if (subData?.plan_type === "pro") {
        const { data: keys } = await supabase
          .from("api_keys")
          .select("id, name, last_used_at, created_at")
          .eq("user_id", user.id)
          .is("revoked_at", null)
          .order("created_at", { ascending: false });
        setApiKeys(keys || []);
      }

      // Load rate limit
      const status = await getRateLimitStatus(user.id);
      setRateLimit(status);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const result = await generateApiKey(newKeyName || undefined);
      if (result.error) {
        alert(result.error);
        return;
      }
      if (result.key) {
        setGeneratedKey(result.key);
        setNewKeyName("");
        await loadData();
      }
    } catch (error) {
      console.error("Failed to generate key:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const result = await revokeApiKey(keyId);
      if (result.error) {
        alert(result.error);
        return;
      }
      await loadData();
    } catch (error) {
      console.error("Failed to revoke key:", error);
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(keyId);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/60 to-primary/5 dark:from-zinc-900/60 dark:to-primary/10 backdrop-blur-sm border-2 border-white/30 dark:border-zinc-800/30">
        <CardContent className="flex items-center justify-center p-16">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 text-primary mx-auto w-fit">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium">
              Cultivating your settings...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPro = subscription?.plan_type === "pro";

  return (
    <div className="space-y-10">
      {/* Subscription Garden */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-primary/10 text-primary">
            <Crown className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif font-bold">
            Subscription Sanctuary
          </h2>
        </div>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200/30 dark:border-amber-800/30 hover:border-amber-300/50 dark:hover:border-amber-700/50 transition-all duration-500">
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>

          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              {isPro ? (
                <Crown className="w-6 h-6 text-amber-600" />
              ) : (
                <Leaf className="w-6 h-6 text-green-600" />
              )}
              Your Growth Plan
            </CardTitle>
            <CardDescription className="text-base">
              Current subscription and creative potential
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-white/60 to-amber-50/60 dark:from-zinc-800/60 dark:to-amber-950/40 border border-amber-200/30 dark:border-amber-800/30">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-serif font-bold capitalize ${
                      isPro
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {subscription?.plan_type || "Free"} Garden
                  </div>
                  {isPro && (
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium">
                      Pro Bloom
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {isPro
                    ? "Unlimited creative energy flowing"
                    : "10 seeds to plant daily"}
                </p>
              </div>
              {!isPro && (
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Grow to Pro
                </Button>
              )}
            </div>

            {/* Usage Visualization */}
            {rateLimit && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50/60 to-emerald-50/60 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/30 dark:border-green-800/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-serif font-semibold text-lg">
                      Daily Growth
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-white/50 dark:bg-zinc-800/50">
                    {rateLimit.count} /{" "}
                    {rateLimit.limit === Infinity ? "∞" : rateLimit.limit}
                  </span>
                </div>

                {/* Organic Progress Bar */}
                <div className="relative w-full h-3 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700 ease-out rounded-full"
                    style={{
                      width:
                        rateLimit.limit === Infinity
                          ? "0%"
                          : `${Math.min(100, (rateLimit.count / rateLimit.limit) * 100)}%`,
                    }}
                  />
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50" />
                </div>

                <div className="flex items-center justify-between mt-3 text-sm text-green-700 dark:text-green-300">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    {rateLimit.remaining === Infinity
                      ? "Unlimited growth"
                      : `${rateLimit.remaining} seeds remaining`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Resets at midnight
                  </span>
                </div>
              </div>
            )}
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/20 via-orange-400/40 to-amber-400/20 rounded-full" />
        </Card>
      </div>

      {/* API Keys Garden (Pro only) */}
      {isPro && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-green-600/10 text-green-600">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold">
              API Key Cultivation
            </h2>
          </div>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/30 dark:border-green-800/30 hover:border-green-300/50 dark:hover:border-green-700/50 transition-all duration-500">
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              <Shield className="w-8 h-8 text-green-600" />
            </div>

            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Key className="w-6 h-6 text-green-600" />
                Programmatic Seeds
              </CardTitle>
              <CardDescription className="text-base">
                Generate and manage API keys for automated growth
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Generated Key Display */}
              {generatedKey && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300/50 dark:border-green-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <p className="font-serif font-semibold text-green-900 dark:text-green-100">
                      Your new API seed has sprouted!
                    </p>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                    Save this carefully - like a rare seed, it won't bloom
                    again:
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-3 bg-white dark:bg-zinc-900 rounded-2xl text-sm font-mono break-all border border-green-200 dark:border-green-800">
                      {generatedKey}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedKey, "new")}
                      className="rounded-full border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20"
                    >
                      {copied === "new" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Generate New Key */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/60 to-green-50/60 dark:from-zinc-800/60 dark:to-green-950/40 border border-green-200/30 dark:border-green-800/30">
                <Label
                  htmlFor="keyName"
                  className="text-base font-serif font-semibold text-green-800 dark:text-green-200 block mb-3"
                >
                  Plant a new API seed
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="keyName"
                    placeholder="Give your seed a name (optional)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 rounded-full border-green-200 dark:border-green-800 focus:border-green-400 dark:focus:border-green-600"
                  />
                  <Button
                    onClick={handleGenerateKey}
                    disabled={isGenerating}
                    className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/20"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Cultivate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Existing Keys Garden */}
              {apiKeys.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-serif font-semibold text-lg flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Leaf className="w-5 h-5" />
                    Your Growing API Garden
                  </h3>
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-white/70 to-green-50/70 dark:from-zinc-800/70 dark:to-green-950/30 border border-green-200/40 dark:border-green-800/40 hover:border-green-300/60 dark:hover:border-green-700/60 transition-all duration-300 group/key"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <p className="font-serif font-semibold text-green-900 dark:text-green-100">
                            {key.name || "Unnamed Seed"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Planted {formatDate(key.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Last growth {formatDate(key.last_used_at)}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRevokeKey(key.id)}
                        className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover/key:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {apiKeys.length === 0 && !generatedKey && (
                <div className="text-center py-12 space-y-4">
                  <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto w-fit">
                    <Key className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
                      Your API garden awaits
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Plant your first API seed to begin programmatic growth
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/20 via-emerald-400/40 to-green-400/20 rounded-full" />
          </Card>
        </div>
      )}

      {/* Account Care Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-600/10 text-blue-600">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif font-bold">Account Cultivation</h2>
        </div>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200/30 dark:border-blue-800/30 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500">
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>

          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Shield className="w-6 h-6 text-blue-600" />
              Profile Sanctuary
            </CardTitle>
            <CardDescription className="text-base">
              Tend to your account details and security
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/70 to-blue-50/70 dark:from-zinc-800/70 dark:to-blue-950/30 border border-blue-200/40 dark:border-blue-800/40">
                <Label className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 block">
                  Email Garden Address
                </Label>
                <div className="text-lg font-serif text-blue-900 dark:text-blue-100 truncate">
                  {/* This would typically come from user data */}
                  Protected by your privacy
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your digital address in the garden
                </p>
              </div>

              {/* Account Status */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/70 to-green-50/70 dark:from-zinc-800/70 dark:to-green-950/30 border border-green-200/40 dark:border-green-800/40">
                <Label className="text-sm font-medium text-green-800 dark:text-green-200 mb-2 block">
                  Garden Status
                </Label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-lg font-serif text-green-900 dark:text-green-100">
                    Flourishing
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your account is growing healthy
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50/60 to-yellow-50/60 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200/30 dark:border-amber-800/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-serif font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Digital Garden Security
                  </p>
                  <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                    Your account is protected by Supabase's secure
                    authentication. Keep your login credentials safe like
                    precious garden tools.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/20 via-cyan-400/40 to-blue-400/20 rounded-full" />
        </Card>
      </div>
    </div>
  );
}
