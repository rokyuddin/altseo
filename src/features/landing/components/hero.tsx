import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { ArrowRight, Sun } from "lucide-react";

export function Hero() {
    return (
        <section className="relative px-4 @xs:px-6 py-24 @xs:py-32 @sm:py-40 @md:py-48 @lg:py-56 min-h-[80vh] @xs:min-h-[85vh] @sm:min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-3/5 h-3/5 bg-accent/20 rounded-full blur-[120px]" />
            </div>

            <div className="@md:max-w-4xl mx-auto space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-card/60 border border-border/50 backdrop-blur-md text-primary font-medium text-sm shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Sun className="size-4" />
                    <span>Natural Language for the Visual Web</span>
                </div>

                <h1 className="text-3xl @xs:text-4xl @sm:text-5xl @md:text-6xl @lg:text-7xl @xl:text-8xl font-bold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Let your images <br />
                    <span className="text-primary italic font-serif">breathe.</span>
                </h1>

                <p className="text-lg @xs:text-xl @md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Cultivate a more accessible, search-optimized web. Generate
                    organic, keyword-rich descriptions that drive discovery while
                    ensuring true inclusivity.
                </p>

                <div className="flex flex-col @sm:flex-row gap-4 justify-center items-center pt-6 @xs:pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="rounded-full h-12 @sm:h-16 px-8 @xs:px-10 @sm:px-12 text-base @xs:text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Plant the Seed
                        </Button>
                    </Link>
                    <Link href="/upload">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full h-12 @sm:h-16 px-6 @xs:px-8 @sm:px-10 text-base @xs:text-lg border-2 border-foreground/10 bg-transparent hover:bg-card/50 backdrop-blur-sm text-foreground"
                        >
                            Try It Free
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 @xs:bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/30">
                <ArrowRight className="size-4 @xs:size-6 rotate-90" />
            </div>
        </section>
    );
}
