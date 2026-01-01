import { Leaf } from "lucide-react";
import { STEPS } from "../utils";



export function MethodologySection() {
    return (
        <section
            id="methodology"
            className="py-32 bg-secondary/30 rounded-4xl mx-4 @md:mx-8"
        >
            <div className="max-w-6xl mx-auto px-6 grid @lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 @lg:order-1 relative">
                    <div className="aspect-4/5 rounded-3xl bg-card shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                            <div className="relative">
                                <Leaf className="size-32 text-primary/30 animate-pulse" />
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8 px-6 py-3 bg-card/90 backdrop-blur rounded-2xl shadow-sm text-sm font-medium text-foreground whitespace-nowrap border border-border">
                                    &quot;A vibrant green fern unfolding...&quot;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-1 @lg:order-2">
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        Our Process
                    </div>
                    <h2 className="text-4xl @md:text-6xl font-bold mb-8 text-foreground leading-tight">
                        From Pixels to <br />
                        <span className="text-primary">Poetry.</span>
                    </h2>
                    <div className="space-y-12">
                        {STEPS.map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="size-12 rounded-2xl bg-card flex items-center justify-center font-bold text-primary shadow-sm shrink-0 border border-border">
                                    {item.step}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-foreground mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">
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
