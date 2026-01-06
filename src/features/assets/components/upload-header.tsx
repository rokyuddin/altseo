import { getUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { isProUser } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    CheckCircle,
    Crown,
    Leaf,
    Sparkles,
    TrendingUp,
    Upload,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Progress } from "@/components/atoms/progress";

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    variant?: "default" | "warning" | "danger" | "success" | "pro" | "blue";
    progress?: number;
    className?: string;
    contentClassName?: string;
}

function StatCard({
    icon: Icon,
    label,
    value,
    variant = "default",
    progress,
    className,
    contentClassName,
}: StatCardProps) {
    const variantStyles = {
        default: "bg-linear-to-br from-stone-100 to-stone-200 text-stone-600 dark:from-stone-800 dark:to-stone-900 dark:text-stone-300",
        warning: "bg-linear-to-br from-amber-100 to-orange-200 text-orange-700",
        danger: "bg-linear-to-br from-red-100 to-rose-200 text-red-700",
        success: "bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700",
        pro: "bg-linear-to-br from-green-400 via-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200/50",
        blue: "bg-linear-to-br from-sky-100 to-indigo-100 text-sky-700",
    };

    const borderStyles = {
        default: "border-stone-200/60 bg-white/40",
        warning: "border-orange-200 bg-orange-50/50",
        danger: "border-red-200 bg-red-50/50",
        success: "border-emerald-200/60 bg-emerald-50/30",
        pro: "border-emerald-400/30 bg-white/10",
        blue: "border-sky-200/60 bg-sky-50/30",
    };

    return (
        <Card
            className={cn(
                "group/card shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl border rounded-[2.5rem] transition-all duration-500",
                borderStyles[variant],
                className
            )}
        >
            <CardContent className={cn("p-7", contentClassName)}>
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "flex justify-center items-center shadow-sm rounded-3xl w-16 h-16 group-hover/card:rotate-3 group-hover/card:scale-110 transition-transform duration-500",
                            variantStyles[variant]
                        )}
                    >
                        <Icon className={cn("w-7 h-7", variant === "pro" ? "text-white" : "")} />
                    </div>
                    <div>
                        <p className="opacity-70 mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                            {label}
                        </p>
                        <p className="font-bold text-foreground/90 text-2xl tracking-tight">{value}</p>
                    </div>
                </div>
                {progress !== undefined && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Usage</span>
                            <span className="font-bold text-[10px] text-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress
                            value={progress}
                            className="bg-stone-100 rounded-full h-2"
                            indicatorClassName={cn(
                                "rounded-full transition-all duration-1000 ease-out",
                                variant === "danger"
                                    ? "bg-red-500"
                                    : variant === "warning"
                                        ? "bg-linear-to-r from-orange-400 to-amber-500"
                                        : "bg-linear-to-r from-emerald-400 to-teal-500"
                            )}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function UploadHeader() {
    const user = use(getUser());
    if (!user) {
        redirect("/login");
    }

    const rateLimit = use(checkRateLimit(user.id));
    const isPro = use(isProUser(user.id));
    const isNearLimit = !isPro && rateLimit.remaining <= 3;
    const isAtLimit = !isPro && rateLimit.remaining === 0;

    let limitVariant: StatCardProps["variant"] = isPro
        ? "pro"
        : isAtLimit
            ? "danger"
            : isNearLimit
                ? "warning"
                : "blue";

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex md:flex-row flex-col justify-between items-start gap-8 pb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 slide-in-from-left-4 text-primary animate-in duration-500 fade-in">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span className="opacity-70 font-bold text-sm uppercase tracking-widest">
                            Upload & Generate
                        </span>
                    </div>
                    <h1 className="slide-in-from-left-6 font-black text-foreground text-5xl md:text-6xl tracking-tight animate-in duration-700 fade-in">
                        Upload <span className="text-primary/90">Assets</span>
                    </h1>
                    <p className="slide-in-from-left-8 max-w-2xl font-medium text-muted-foreground text-xl leading-relaxed animate-in duration-1000 fade-in">
                        Transform your images with AI-powered, SEO-optimized metadata in a single drop.
                    </p>
                </div>

                {/* Plan Badge */}
                <div className="slide-in-from-right-4 flex items-center gap-4 animate-in duration-700 fade-in">
                    {isPro ? (
                        <div className="flex items-center gap-3 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 shadow-emerald-200/40 shadow-xl px-8 py-4 border border-white/20 rounded-3xl font-bold text-white text-sm hover:scale-105 transition-transform duration-500 cursor-default">
                            <Crown className="w-5 h-5" />
                            PRO PLAN ACTIVE
                        </div>
                    ) : (
                        <Button
                            asChild
                            className="bg-linear-to-r from-emerald-600 to-teal-600 shadow-emerald-200/50 shadow-xl hover:shadow-2xl px-10 py-7 border-0 rounded-3xl font-bold text-white text-base hover:scale-105 active:scale-95 transition-all hover:-translate-y-1"
                        >
                            <Link href="/?scroll=pricing">
                                <TrendingUp className="mr-3 w-5 h-5" />
                                Growth Plan Upgrade
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Usage Stats Banner */}
            <div className="slide-in-from-bottom-8 gap-6 grid grid-cols-1 md:grid-cols-3 animate-in duration-1000 fade-in">
                <StatCard
                    icon={isPro ? Crown : isAtLimit ? AlertCircle : Upload}
                    label="Daily Credit Space"
                    value={isPro ? "Unlimited Access" : `${rateLimit.remaining} / ${rateLimit.limit}`}
                    variant={limitVariant}
                    progress={
                        !isPro
                            ? (rateLimit.remaining / rateLimit.limit) * 100
                            : undefined
                    }
                />

                <StatCard
                    icon={Zap}
                    label="Active Engine"
                    value={isPro ? "Bulk Processing" : "Single Stream"}
                    variant="blue"
                />

                <StatCard
                    icon={CheckCircle}
                    label="Intelligence"
                    value={isPro ? "Priority Neural" : "Standard Model"}
                    variant="success"
                />
            </div>

            {/* Warnings */}
            {isAtLimit && (
                <Alert
                    variant="destructive"
                    className="bg-red-50/80 shadow-2xl shadow-red-100/50 backdrop-blur-xl p-8 border-red-200 rounded-[2.5rem] animate-in duration-500 zoom-in"
                >
                    <div className="flex items-start gap-6">
                        <div className="flex justify-center items-center bg-linear-to-br from-red-100 to-rose-200 shadow-inner rounded-3xl w-16 h-16 shrink-0">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <AlertTitle className="font-black text-red-950 text-2xl tracking-tight">
                                Daily Limit Reached
                            </AlertTitle>
                            <AlertDescription className="font-medium text-red-800/80 text-base leading-relaxed">
                                You&apos;ve utilized your daily quota of {rateLimit.limit} images.
                                Upgrade to our Pro tier for boundless creative potential or return at dawn.
                            </AlertDescription>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 px-8 rounded-2xl h-12 font-bold text-white"
                                >
                                    <Link href="/pricing">
                                        <Crown className="mr-2 w-4 h-4" />
                                        Unlock Unlimited
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Alert>
            )}

            {isNearLimit && !isAtLimit && (
                <Alert
                    variant="default"
                    className="slide-in-from-right-8 bg-amber-50/80 shadow-amber-100/50 shadow-xl backdrop-blur-xl p-8 border-amber-200 rounded-[2.5rem] animate-in duration-700"
                >
                    <div className="flex items-start gap-6">
                        <div className="flex justify-center items-center bg-linear-to-br from-amber-100 to-orange-200 shadow-inner rounded-3xl w-16 h-16 shrink-0">
                            <AlertCircle className="w-8 h-8 text-amber-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <AlertTitle className="font-black text-amber-950 text-2xl tracking-tight">
                                Running Low
                            </AlertTitle>
                            <AlertDescription className="font-medium text-amber-800/80 text-base leading-relaxed">
                                Only {rateLimit.remaining} uploads remain in your current cycle.
                                Secure a Pro membership now to avoid interruptions.
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}

            {!isPro && !isAtLimit && !isNearLimit && (
                <Alert className="slide-in-from-bottom-8 bg-stone-50/60 shadow-lg shadow-stone-100/50 backdrop-blur-xl p-8 border-stone-200 rounded-[2.5rem] animate-in duration-1000">
                    <div className="flex items-start gap-6">
                        <div className="flex justify-center items-center bg-linear-to-br from-emerald-100 to-teal-100 shadow-inner rounded-3xl w-16 h-16 shrink-0">
                            <Sparkles className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <AlertTitle className="font-black text-foreground/90 text-2xl tracking-tight">
                                Growth Mode
                            </AlertTitle>
                            <AlertDescription className="font-medium text-muted-foreground text-base leading-relaxed">
                                You&apos;re currently on the entry tier with {rateLimit.limit} daily credits.
                                Amplify your workflow with bulk processing and neural priority.
                            </AlertDescription>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="bg-white hover:bg-stone-50 shadow-md px-8 border-stone-200 rounded-2xl h-12 font-bold text-foreground"
                                >
                                    <Link href="/pricing">
                                        Explore Pro Features
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Alert>
            )}
        </div>
    );
}
