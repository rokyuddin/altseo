import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { ArrowRight, Sun } from "lucide-react";

export function Hero() {
    return (
        <section className="relative flex flex-col justify-center items-center px-4 py-20 md:py-40 lg:py-48 xl:py-56 min-h-svh overflow-hidden text-center">
            {/* Dynamic Background */}
            <div className="-z-10 absolute inset-0 overflow-hidden">
                <div className="-top-[10%] -left-[10%] absolute bg-primary/10 blur-[80px] rounded-full w-1/2 h-1/2 animate-pulse" />
                <div className="-right-[10%] -bottom-[10%] absolute bg-accent/20 blur-[100px] rounded-full w-3/5 h-3/5" />
            </div>

            <div className="z-10 relative space-y-6 mx-auto max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
                <div className="inline-flex slide-in-from-bottom-4 items-center gap-2 bg-card/60 shadow-sm backdrop-blur-md px-4 py-2 border border-border/50 rounded-full font-medium text-primary text-xs animate-in duration-1000 fade-in">
                    <Sun className="size-3" />
                    <span className="text-xs">Natural Language for the Visual Web</span>
                </div>

                <h1 className="slide-in-from-bottom-6 font-bold text-foreground text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight animate-in duration-1000 delay-100 fade-in">
                    Let your images <br className="hidden" />
                    <span className="font-serif text-primary italic">breathe.</span>
                </h1>

                <p className="slide-in-from-bottom-8 mx-auto px-2 xs:px-0 max-w-xs sm:max-w-xl md:max-w-2xl font-light text-muted-foreground text-base sm:text-xl md:text-2xl leading-relaxed animate-in duration-1000 delay-200 fade-in">
                    Cultivate a more accessible, search-optimized web. Generate
                    organic, keyword-rich descriptions that drive discovery while
                    ensuring true inclusivity.
                </p>

                <div className="slide-in-from-bottom-10 flex sm:flex-row flex-col justify-center items-center gap-3 pt-6 animate-in duration-1000 delay-300 fade-in">
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="bg-foreground hover:bg-foreground/90 shadow-xl hover:shadow-2xl px-6 md:px-12 rounded-full w-full h-10 md:h-16 text-background text-sm md:text-lg transition-all hover:-translate-y-1"
                        >
                            Plant the Seed
                        </Button>
                    </Link>
                    <Link href="/assets/upload">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-transparent hover:bg-card/50 backdrop-blur-sm px-6 md:px-10 border-2 border-foreground/10 rounded-full w-full h-10 md:h-16 text-foreground text-sm xs:text-base md:text-lg"
                        >
                            Try It Free
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="bottom-8 xs:bottom-12 left-1/2 absolute text-muted-foreground/30 -translate-x-1/2 animate-bounce">
                <ArrowRight className="size-5 xs:size-6 rotate-90" />
            </div>
        </section>
    );
}
