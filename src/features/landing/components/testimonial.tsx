import { Sparkles } from "lucide-react";

export function TestimonialSection() {
    return (
        <section className="py-20 @md:py-40 px-4 @md:px-6 container-section">
            <div className="max-w-4xl mx-auto text-center relative">
                <Sparkles className="size-8 @md:size-12 text-accent absolute -top-4 @md:-top-6 -left-2 @md:-left-6 animate-pulse opacity-50 @md:opacity-100" />
                <div className="bg-card p-8 @md:p-16 rounded-3xl @md:rounded-4xl shadow-sm border border-border">
                    <p className="text-xl @md:text-4xl font-serif italic text-foreground leading-relaxed mb-6 @md:mb-8">
                        &quot;AltSEO brings a human touch to automation. The
                        descriptions feel hand-crafted, warm, and surprisingly
                        insightful.&quot;
                    </p>
                    <div className="flex flex-col items-center">
                        <div className="size-12 @md:size-16 bg-primary/10 rounded-full mb-3 @md:mb-4 flex items-center justify-center text-primary font-bold text-lg @md:text-xl border border-primary/20">
                            S
                        </div>
                        <div className="font-bold text-foreground">Sarah Jenkins</div>
                        <div className="text-xs @md:text-sm text-muted-foreground font-medium">
                            Head of Accessibility, Nature Conservancy
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
