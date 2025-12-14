'use client'

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import {
  CheckCircle,
  Leaf,
  Crown,
  ArrowRight,
  Sparkles,
  Check,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PricingSectionProps {
  user?: any;
  userPlan?: string;
  showSuccess?: boolean;
}

export function PricingSection({ user, userPlan, showSuccess }: PricingSectionProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('scroll') === 'pricing') {
      const element = document.getElementById('pricing');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up the URL parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('scroll');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams]);

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/register');
      return;
    }

    setIsUpgrading(true);
    try {
      const response = await fetch('/api/upgrade-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Show success state briefly, then redirect
        setTimeout(() => {
          setIsUpgrading(false);
          // Redirect to home page with success message
          router.push('/?success=upgrade#pricing');
        }, 1000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to upgrade plan');
        setIsUpgrading(false);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to upgrade plan. Please try again.');
      setIsUpgrading(false);
    }
  };
  return (
    <section id="pricing" className="py-32 px-6 relative">
      {/* Organic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background rounded-[4rem] mx-4 md:mx-8 -z-10"></div>

      {/* Success Alert */}
      {showSuccess && (
        <div className="max-w-2xl mx-auto mb-12">
          <Alert className="bg-green-50 border-green-200 text-green-800 rounded-[2rem] border-2">
            <Check className="w-5 h-5" />
            <AlertDescription className="text-lg font-medium">
              Welcome to Pro! Your plan has been upgraded successfully. Enjoy unlimited access to all features.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
            Choose Your Plan
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Grow Naturally with AltSEO
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Start free and scale as your needs blossom. Our plans are designed to nurture your creative journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-[2.5rem] transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">Free</CardTitle>
              <div className="text-3xl font-bold text-primary mb-1">$0</div>
              <p className="text-sm text-muted-foreground">Perfect for getting started</p>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              <div className="space-y-3">
                {[
                  "10 images per day",
                  "Single uploads",
                  "High-quality alt text",
                  "Download results"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {user ? (
                  userPlan === 'free' ? (
                    <div className="text-center">
                      <Badge variant="secondary">
                        Current Plan
                      </Badge>
                    </div>
                  ) : (
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full rounded-full border-primary/30 hover:bg-primary/5">
                        Dashboard
                      </Button>
                    </Link>
                  )
                ) : (
                  <Link href="/register">
                    <Button variant="outline" className="w-full rounded-full border-primary/30 hover:bg-primary/5">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative bg-gradient-to-br from-white via-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.10)] rounded-[2.5rem] transition-all duration-500 hover:-translate-y-1">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full font-bold text-xs">
                🌱 Popular
              </div>
            </div>

            <CardHeader className="text-center pb-6 pt-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">Pro</CardTitle>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">$9.99</div>
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
                  "Priority support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {user ? (
                  userPlan === 'pro' ? (
                    <div className="text-center">
                      <Badge variant="default">
                        Current Plan
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={handleUpgrade}
                      disabled={isUpgrading}
                      className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      {isUpgrading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Upgrading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Upgrade Now
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <Link href="/register">
                    <Button className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
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
