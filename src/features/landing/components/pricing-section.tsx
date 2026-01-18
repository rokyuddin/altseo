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
import { CreemCheckout } from "@creem_io/nextjs";

interface PricingSectionProps {
  user?: any;
  userPlan?: string;
}

export function PricingSection({ user, userPlan }: PricingSectionProps) {
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
    // This function is now mostly for analytics or pre-checkout logic if needed
    // But CreemCheckout handles the actual redirect.
    setIsUpgrading(false);
  };

  return (
    <section
      id="pricing"
      className="relative px-4 @md:px-6 py-16 @md:py-32 container-section"
    >
      {/* Organic Background */}
      <div className="-z-10 absolute inset-0 bg-linear-to-b from-background via-secondary/20 to-background mx-2 @md:mx-8 rounded-3xl @md:rounded-4xl" />

      {/* Success Alert */}
      {showSuccess && (
        <div className="slide-in-from-top-4 mx-auto mb-10 @md:mb-12 max-w-2xl animate-in duration-500 fade-in">
          <Alert className="bg-primary/10 border-2 border-primary rounded-2xl @md:rounded-3xl text-primary">
            <Check className="size-5" />
            <AlertDescription className="font-medium text-base @md:text-lg">
              Welcome to Pro! Your plan has been upgraded successfully. Enjoy
              unlimited access to all features.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="z-10 relative mx-auto max-w-6xl">
        <div className="mb-12 @md:mb-20 text-center">
          <div className="inline-block bg-primary/10 mb-6 px-4 py-1 rounded-full font-bold text-[10px] text-primary @md:text-xs uppercase tracking-widest">
            Choose Your Plan
          </div>
          <h2 className="mb-6 font-bold text-foreground text-3xl @md:text-6xl leading-tight">
            Grow Naturally with AltSEO
          </h2>
          <p className="mx-auto max-w-2xl font-light text-muted-foreground text-lg @md:text-xl">
            Start free and scale as your needs blossom. Our plans are designed
            to nurture your creative journey.
          </p>
        </div>

        <div className="gap-6 @md:gap-8 lg:gap-12 grid grid-cols-1 @md:grid-cols-2 mx-auto max-w-4xl">
          {/* Free Plan */}
          <Card className="bg-card/80 shadow-sm hover:shadow-md backdrop-blur-sm border border-border rounded-3xl @md:rounded-4xl transition-all hover:-translate-y-1 duration-500">
            <CardHeader className="pt-8 pb-6 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto mb-4 border border-primary/20 rounded-full size-14 @md:size-16">
                <Leaf className="size-7 @md:size-8 text-primary" />
              </div>
              <CardTitle className="mb-1 @md:mb-2 font-bold text-foreground text-xl @md:text-2xl">
                Free
              </CardTitle>
              <div className="mb-1 font-bold text-primary text-2xl @md:text-3xl">
                $0
              </div>
              <p className="text-muted-foreground text-xs @md:text-sm">
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
                    <span className="text-foreground text-sm">{feature}</span>
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
                        className="hover:bg-primary/5 py-5 @md:py-6 border-primary/30 rounded-full w-full"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )
                ) : (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="hover:bg-primary/5 py-5 @md:py-6 border-primary/30 rounded-full w-full font-semibold"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative bg-linear-to-br from-card via-primary/5 to-accent/5 shadow-md hover:shadow-lg backdrop-blur-sm border border-primary/20 rounded-3xl @md:rounded-4xl transition-all hover:-translate-y-1 duration-500">
            {/* Popular Badge */}
            <div className="-top-3 left-1/2 z-20 absolute -translate-x-1/2">
              <div className="bg-linear-to-r from-primary to-accent shadow-sm px-4 py-1 rounded-full font-bold text-[10px] text-primary-foreground @md:text-xs">
                🌱 Popular
              </div>
            </div>

            <CardHeader className="pt-10 pb-6 text-center">
              <div className="flex justify-center items-center bg-linear-to-br from-primary/10 to-accent/10 mx-auto mb-4 border border-primary/20 rounded-full size-14 @md:size-16">
                <Crown className="size-7 @md:size-8 text-primary" />
              </div>
              <CardTitle className="mb-1 @md:mb-2 font-bold text-foreground text-xl @md:text-2xl">
                Pro
              </CardTitle>
              <div className="bg-clip-text bg-linear-to-r from-primary to-accent mb-1 font-serif font-bold text-transparent text-2xl @md:text-3xl italic">
                $9.99
              </div>
              <p className="text-muted-foreground text-xs @md:text-sm">
                Per month
              </p>
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
                    <span className="text-foreground text-sm">{feature}</span>
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
                    <CreemCheckout
                      productId={process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID!}
                      referenceId={user.id}
                      customer={{ email: user.email }}
                      metadata={{
                        userId: user.id,
                        plan: "pro",
                      }}
                    >
                      <Button
                        disabled={isUpgrading}
                        className="bg-linear-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 py-5 @md:py-6 rounded-full w-full font-semibold transition-opacity"
                      >
                        {isUpgrading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Upgrading...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 size-4" />
                            Upgrade Now
                          </>
                        )}
                      </Button>
                    </CreemCheckout>
                  )
                ) : (
                  <Link href="/register">
                    <Button className="bg-linear-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 py-5 @md:py-6 rounded-full w-full font-bold transition-opacity">
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
