"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Key,
  Copy,
  Check,
  Trash2,
  Plus,
  AlertCircle,
  Clock,
  Code,
  Shield,
  Leaf,
  Sparkles,
} from "lucide-react";

interface ApiKey {
  id: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
}

export default function ApiKeysClient({
  initialKeys,
}: {
  initialKeys: ApiKey[];
}) {
  const [keys, setKeys] = useState(initialKeys);
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setGenerating(true);

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate key");
      }

      const data = await res.json();
      setNewKey(data.key);
      setKeys([data.apiKey, ...keys]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke key");
      }

      setKeys(keys.filter((k) => k.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="px-6 py-12 space-y-8 relative z-10">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Key className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">
                API Access
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              API Keys
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Manage your API keys for programmatic access to AltSEO
            </p>
          </div>
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-foreground shadow-md hover:shadow-lg transition-all border border-white/60 hover:-translate-y-0.5"
          >
            <Code className="h-4 w-4" />
            {showDocs ? "Hide" : "View"} API Docs
          </button>
        </div>

        {/* API Documentation */}
        {showDocs && (
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-[2rem] p-8 border border-blue-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-100 to-green-100 flex-shrink-0">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  API Documentation
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Use the AltSEO API to generate alt text programmatically.
                </p>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Endpoint
                    </h4>
                    <div className="rounded-[1rem] bg-white/80 backdrop-blur-sm p-4 border border-blue-100">
                      <code className="text-sm text-foreground font-mono">
                        POST https://your-domain.com/api/generate-alt-text
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Authentication
                    </h4>
                    <div className="rounded-[1rem] bg-white/80 backdrop-blur-sm p-4 border border-blue-100">
                      <code className="text-sm text-foreground font-mono">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Example Request (cURL)
                    </h4>
                    <div className="rounded-[1rem] bg-white/80 backdrop-blur-sm p-4 border border-blue-100 overflow-x-auto">
                      <pre className="text-xs text-foreground font-mono">
                        {`curl -X POST https://your-domain.com/api/generate-alt-text \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/image.jpg" \\
  -F "style=seo"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Example Response
                    </h4>
                    <div className="rounded-[1rem] bg-white/80 backdrop-blur-sm p-4 border border-blue-100 overflow-x-auto">
                      <pre className="text-xs text-foreground font-mono">
                        {`{
  "success": true,
  "alt_text": "A golden retriever playing in a sunny park",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "file_size": 524288
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Key Alert */}
        {newKey && (
          <div className="bg-green-50/80 backdrop-blur-sm rounded-[2rem] p-8 border border-green-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-green-100 to-emerald-100 flex-shrink-0">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-green-900 mb-2">
                  API Key Generated Successfully!
                </p>
                <p className="text-sm text-green-800 mb-4 leading-relaxed">
                  Save this key securely. You won't be able to see it again.
                </p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 rounded-[1rem] bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-green-900 font-mono border border-green-100">
                    {newKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newKey, "new-key")}
                    className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 shadow-md hover:shadow-lg"
                  >
                    {copied === "new-key" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-red-200 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-green-100 to-blue-100">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Generate New API Key
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create a new API key for your applications
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-all hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {generating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Generate New Key
                </>
              )}
            </button>
          </div>
        </div>

        {/* API Keys List */}
        {keys.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Your API Keys ({keys.length})
              </h2>
            </div>

            <div className="space-y-4">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-stone-100 to-stone-200">
                        <Key className="h-5 w-5 text-stone-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <code className="text-base font-mono font-bold text-foreground">
                            {key.key_prefix}...
                          </code>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Created{" "}
                            {format(new Date(key.created_at), "MMM d, yyyy")}
                          </span>
                          {key.last_used_at ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                              Last used{" "}
                              {format(
                                new Date(key.last_used_at),
                                "MMM d, yyyy"
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">
                              Never used
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 hover:shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-stone-100 to-stone-200 mb-6">
              <Key className="h-10 w-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No API Keys Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Generate your first API key to start using the AltSEO API
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-stone-50/80 backdrop-blur-sm rounded-[2rem] p-8 border border-stone-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-stone-100 to-stone-200 flex-shrink-0">
              <Shield className="h-5 w-5 text-stone-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground mb-3">
                Security Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 mt-1">•</span>
                  <span>
                    Never share your API keys publicly or commit them to version
                    control
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 mt-1">•</span>
                  <span>Store keys securely using environment variables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 mt-1">•</span>
                  <span>Revoke keys immediately if they are compromised</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 mt-1">•</span>
                  <span>
                    Use different keys for different applications or
                    environments
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
