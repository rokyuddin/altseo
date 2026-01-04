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
                "backdrop-blur-xl rounded-[2.5rem] border transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] group/card",
                borderStyles[variant],
                className
            )}
        >
            <CardContent className={cn("p-7", contentClassName)}>
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "flex h-16 w-16 items-center justify-center rounded-3xl shadow-sm transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-3",
                            variantStyles[variant]
                        )}
                    >
                        <Icon className={cn("h-7 w-7", variant === "pro" ? "text-white" : "")} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 opacity-70">
                            {label}
                        </p>
                        <p className="text-2xl font-bold text-foreground/90 tracking-tight">{value}</p>
                    </div>
                </div>
                {progress !== undefined && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Usage</span>
                            <span className="text-[10px] font-bold text-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress
                            value={progress}
                            className="h-2 rounded-full bg-stone-100"
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
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold tracking-widest uppercase opacity-70">
                            Upload & Generate
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight animate-in fade-in slide-in-from-left-6 duration-700">
                        Upload <span className="text-primary/90">Assets</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000">
                        Transform your images with AI-powered, SEO-optimized metadata in a single drop.
                    </p>
                </div>

                {/* Plan Badge */}
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                    {isPro ? (
                        <div className="flex items-center gap-3 rounded-3xl bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-200/40 border border-white/20 hover:scale-105 transition-transform duration-500 cursor-default">
                            <Crown className="h-5 w-5" />
                            PRO PLAN ACTIVE
                        </div>
                    ) : (
                        <Button
                            asChild
                            className="rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 px-10 py-7 text-base font-bold text-white shadow-xl shadow-emerald-200/50 transition-all hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-0"
                        >
                            <Link href="/?scroll=pricing">
                                <TrendingUp className="h-5 w-5 mr-3" />
                                Growth Plan Upgrade
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Usage Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
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
                    className="bg-red-50/80 backdrop-blur-xl rounded-[2.5rem] border-red-200 shadow-2xl shadow-red-100/50 p-8 animate-in zoom-in duration-500"
                >
                    <div className="flex items-start gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-red-100 to-rose-200 shrink-0 shadow-inner">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <AlertTitle className="text-2xl font-black text-red-950 tracking-tight">
                                Daily Limit Reached
                            </AlertTitle>
                            <AlertDescription className="text-base text-red-800/80 leading-relaxed font-medium">
                                You&apos;ve utilized your daily quota of {rateLimit.limit} images.
                                Upgrade to our Pro tier for boundless creative potential or return at dawn.
                            </AlertDescription>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    className="rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold px-8 h-12 shadow-lg shadow-red-200"
                                >
                                    <Link href="/pricing">
                                        <Crown className="h-4 w-4 mr-2" />
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
                    className="bg-amber-50/80 backdrop-blur-xl rounded-[2.5rem] border-amber-200 shadow-xl shadow-amber-100/50 p-8 animate-in slide-in-from-right-8 duration-700"
                >
                    <div className="flex items-start gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-amber-100 to-orange-200 shrink-0 shadow-inner">
                            <AlertCircle className="h-8 w-8 text-amber-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <AlertTitle className="text-2xl font-black text-amber-950 tracking-tight">
                                Running Low
                            </AlertTitle>
                            <AlertDescription className="text-base text-amber-800/80 font-medium leading-relaxed">
                                Only {rateLimit.remaining} uploads remain in your current cycle.
                                Secure a Pro membership now to avoid interruptions.
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}

            {!isPro && !isAtLimit && !isNearLimit && (
                <Alert className="bg-stone-50/60 backdrop-blur-xl rounded-[2.5rem] border-stone-200 shadow-lg shadow-stone-100/50 p-8 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-start gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-100 to-teal-100 shrink-0 shadow-inner">
                            <Sparkles className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <AlertTitle className="text-2xl font-black text-foreground/90 tracking-tight">
                                Growth Mode
                            </AlertTitle>
                            <AlertDescription className="text-base text-muted-foreground font-medium leading-relaxed">
                                You&apos;re currently on the entry tier with {rateLimit.limit} daily credits.
                                Amplify your workflow with bulk processing and neural priority.
                            </AlertDescription>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="rounded-2xl bg-white hover:bg-stone-50 text-foreground font-bold px-8 h-12 shadow-md border-stone-200"
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
