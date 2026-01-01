import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { ArrowRight, Sun } from "lucide-react";

export function Hero() {
    return (
        <section className="relative px-4 py-20 md:py-40 lg:py-48 xl:py-56 min-h-svh flex flex-col justify-center items-center text-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-3/5 h-3/5 bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/50 backdrop-blur-md text-primary font-medium text-xs shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Sun className="size-3" />
                    <span className="text-xs">Natural Language for the Visual Web</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Let your images <br className="hidden" />
                    <span className="text-primary italic font-serif">breathe.</span>
                </h1>

                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-xs sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 px-2 xs:px-0">
                    Cultivate a more accessible, search-optimized web. Generate
                    organic, keyword-rich descriptions that drive discovery while
                    ensuring true inclusivity.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="w-full rounded-full h-10 md:h-16 px-6 md:px-12 text-sm md:text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Plant the Seed
                        </Button>
                    </Link>
                    <Link href="/upload">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full h-10 md:h-16 px-6 md:px-10 text-sm xs:text-base md:text-lg border-2 border-foreground/10 bg-transparent hover:bg-card/50 backdrop-blur-sm text-foreground"
                        >
                            Try It Free
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 xs:bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/30">
                <ArrowRight className="size-5 xs:size-6 rotate-90" />
            </div>
        </section>
    );
}
