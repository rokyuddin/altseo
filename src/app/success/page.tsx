import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
interface SuccessPageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  const orderId = params.order_id as string;
  const checkoutId = params.checkout_id as string;
  const productId = params.product_id as string;
  return (
    <div className="relative flex justify-center items-center bg-background p-4 @md:p-6 min-h-screen overflow-hidden">
      {/* Premium Background Elements */}
      <div className="top-0 left-0 -z-10 absolute w-full h-full overflow-hidden">
        <div className="top-[-10%] left-[-10%] absolute bg-primary/10 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow" />
        <div className="right-[-10%] bottom-[-10%] absolute bg-accent/10 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow duration-700" />
      </div>

      <div className="z-10 relative w-full max-w-xl">
        <Card className="bg-card/60 shadow-2xl backdrop-blur-xl border-border/40 rounded-[2.5rem] overflow-hidden">
          <CardContent className="px-6 @md:px-10 pt-12 pb-10 text-center">
            {/* Success Icon */}
            <div className="inline-block relative mb-8">
              <div className="z-10 relative flex justify-center items-center bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/30 rounded-full size-20 @md:size-24">
                <Check className="stroke-[3px] size-10 @md:size-12 text-primary-foreground" />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full size-20 @md:size-24 animate-ping duration-1000" />
              <div className="absolute inset-[-10px] border border-primary/10 rounded-full size-[100px] @md:size-[116px] animate-pulse-slow" />

              {/* Floating particles */}
              <Sparkles className="-top-2 -right-2 absolute size-6 text-primary animate-bounce duration-700" />
            </div>

            <h1 className="bg-clip-text bg-linear-to-r from-foreground to-foreground/70 mb-4 font-bold text-transparent text-3xl @md:text-5xl">
              Upgrade Successful!
            </h1>

            <p className="mx-auto mb-10 max-w-[320px] text-muted-foreground text-lg leading-relaxed">
              Welcome to the <span className="font-bold text-primary">Pro</span>{" "}
              family. Your new powers are now active.
            </p>

            {/* Order Details */}
            {(orderId || checkoutId) && (
              <div className="space-y-4 bg-muted/30 mb-10 p-6 border border-border/40 rounded-3xl text-left">
                <h3 className="opacity-70 font-semibold text-foreground text-xs uppercase tracking-widest">
                  Order Information
                </h3>
                <div className="space-y-3">
                  {orderId && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="bg-muted px-2 py-1 border border-border/50 rounded-lg font-mono font-medium text-[10px] text-foreground">
                        {orderId}
                      </span>
                    </div>
                  )}
                  {checkoutId && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Checkout ID</span>
                      <span className="bg-muted px-2 py-1 border border-border/50 rounded-lg max-w-[120px] @md:max-w-none font-mono font-medium text-[10px] text-foreground truncate">
                        {checkoutId}
                      </span>
                    </div>
                  )}
                  {productId && (
                    <div className="flex justify-between items-center pt-1 border-border/20 border-t text-sm">
                      <span className="text-muted-foreground">Plan</span>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20 border-none font-bold text-primary"
                      >
                        PRO MONTHLY
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="gap-4 grid grid-cols-1 @sm:grid-cols-2">
              <Link href="/dashboard" className="w-full">
                <Button className="group bg-linear-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 rounded-2xl w-full h-14 font-semibold text-base transition-all">
                  Go to Dashboard
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/" className="w-full">
                <Button
                  variant="outline"
                  className="hover:bg-secondary/20 border-border/60 rounded-2xl w-full h-14 font-medium text-base transition-all"
                >
                  Back Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bottom micro-copy */}
        <p className="mt-8 font-medium text-muted-foreground/50 text-sm text-center">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  );
}
