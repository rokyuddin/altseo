import { Leaf } from "lucide-react";
import { STEPS } from "../utils";

export function MethodologySection() {
    return (
        <section
            id="methodology"
            className="py-16 @md:py-32 bg-secondary/30 rounded-2xl @md:rounded-4xl mx-2 @md:mx-8 container-section"
        >
            <div className="max-w-6xl mx-auto px-4 @md:px-6 grid grid-cols-1 @lg:grid-cols-2 gap-12 @lg:gap-20 items-center">
                <div className="order-2 @lg:order-1 relative">
                    <div className="aspect-square @md:aspect-4/5 rounded-2xl @md:rounded-3xl bg-card shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                            <div className="relative text-center px-6">
                                <Leaf className="size-20 @md:size-32 text-primary/30 animate-pulse mx-auto" />
                                <div className="mt-8 px-4 @md:px-6 py-2 @md:py-3 bg-card/90 backdrop-blur rounded-xl @md:rounded-2xl shadow-sm text-xs @md:text-sm font-medium text-foreground border border-border">
                                    &quot;A vibrant green fern unfolding...&quot;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-1 @lg:order-2">
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] @md:text-xs uppercase tracking-widest mb-6">
                        Our Process
                    </div>
                    <h2 className="text-3xl @md:text-5xl @xl:text-6xl font-bold mb-6 @md:mb-8 text-foreground leading-tight">
                        From Pixels to <br />
                        <span className="text-primary italic font-serif">Poetry.</span>
                    </h2>
                    <div className="space-y-8 @md:space-y-12">
                        {STEPS.map((item, i) => (
                            <div key={i} className="flex gap-4 @md:gap-6">
                                <div className="size-10 @md:size-12 rounded-xl @md:rounded-2xl bg-card flex items-center justify-center font-bold text-primary shadow-sm shrink-0 border border-border text-sm @md:text-base">
                                    {item.step}
                                </div>
                                <div>
                                    <h4 className="text-lg @md:text-xl font-bold text-foreground mb-1 @md:mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm @md:text-base text-muted-foreground leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
