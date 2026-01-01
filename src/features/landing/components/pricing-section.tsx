"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import {
  CheckCircle,
  Leaf,
  Crown,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PricingSectionProps {
  user?: any;
  userPlan?: string;
}

export function PricingSection({
  user,
  userPlan,
}: PricingSectionProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "upgrade";

  useEffect(() => {
    if (searchParams.get("scroll") === "pricing") {
      const element = document.getElementById("pricing");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        const url = new URL(window.location.href);
        url.searchParams.delete("scroll");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams]);

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/register");
      return;
    }

    setIsUpgrading(true);
    try {
      const response = await fetch("/api/upgrade-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setTimeout(() => {
          setIsUpgrading(false);
          router.push("/?success=upgrade#pricing");
        }, 1000);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to upgrade plan");
        setIsUpgrading(false);
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Failed to upgrade plan. Please try again.");
      setIsUpgrading(false);
    }
  };

  return (
    <section id="pricing" className="py-32 px-6 relative container-inline-size">
      {/* Organic Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/20 to-background rounded-4xl mx-4 @md:mx-8 -z-10" />

      {/* Success Alert */}
      {showSuccess && (
        <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <Alert className="bg-primary/10 border-primary text-primary rounded-3xl border-2">
            <Check className="size-5" />
            <AlertDescription className="text-lg font-medium">
              Welcome to Pro! Your plan has been upgraded successfully. Enjoy
              unlimited access to all features.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
            Choose Your Plan
          </div>
          <h2 className="text-4xl @md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Grow Naturally with AltSEO
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Start free and scale as your needs blossom. Our plans are designed
            to nurture your creative journey.
          </p>
        </div>

        <div className="grid @md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:shadow-md rounded-4xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Leaf className="size-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Free
              </CardTitle>
              <div className="text-3xl font-bold text-primary mb-1">$0</div>
              <p className="text-sm text-muted-foreground">
                Perfect for getting started
              </p>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              <div className="space-y-3">
                {[
                  "10 images per day",
                  "Single uploads",
                  "High-quality alt text",
                  "Download results",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {user ? (
                  userPlan === "free" ? (
                    <div className="text-center">
                      <Badge variant="secondary" className="rounded-full">
                        Current Plan
                      </Badge>
                    </div>
                  ) : (
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary/30 hover:bg-primary/5"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )
                ) : (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary/30 hover:bg-primary/5 font-semibold"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative bg-linear-to-br from-card via-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-md hover:shadow-lg rounded-4xl transition-all duration-500 hover:-translate-y-1">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-linear-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full font-bold text-xs shadow-sm">
                🌱 Popular
              </div>
            </div>

            <CardHeader className="text-center pb-6 pt-10">
              <div className="size-16 bg-linear-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Crown className="size-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Pro
              </CardTitle>
              <div className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-1 font-serif">
                $9.99
              </div>
              <p className="text-sm text-muted-foreground">Per month</p>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              <div className="space-y-3">
                {[
                  "Unlimited uploads",
                  "Priority processing",
                  "API access (1000 req/mo)",
                  "Advanced features",
                  "Full history",
                  "Priority support",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {user ? (
                  userPlan === "pro" ? (
                    <div className="text-center">
                      <Badge variant="default" className="rounded-full">
                        Current Plan
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={handleUpgrade}
                      disabled={isUpgrading}
                      className="w-full rounded-full bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity font-semibold shadow-lg shadow-primary/20"
                    >
                      {isUpgrading ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Upgrading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4 mr-2" />
                          Upgrade Now
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <Link href="/register">
                    <Button className="w-full rounded-full bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity font-bold shadow-lg shadow-primary/20">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
