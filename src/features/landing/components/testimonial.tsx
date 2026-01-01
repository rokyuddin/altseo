import { Sparkles } from "lucide-react";

export function TestimonialSection() {
    return (
        <section className="py-40 px-6">
            <div className="max-w-4xl mx-auto text-center relative">
                <Sparkles className="size-12 text-accent absolute -top-6 -left-6 animate-pulse" />
                <div className="bg-card p-12 @md:p-16 rounded-4xl shadow-sm border border-border">
                    <p className="text-2xl @md:text-4xl font-serif italic text-foreground leading-relaxed mb-8">
                        &quot;AltSEO brings a human touch to automation. The
                        descriptions feel hand-crafted, warm, and surprisingly
                        insightful.&quot;
                    </p>
                    <div className="flex flex-col items-center">
                        <div className="size-16 bg-primary/10 rounded-full mb-4 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                            S
                        </div>
                        <div className="font-bold text-foreground">Sarah Jenkins</div>
                        <div className="text-sm text-muted-foreground font-medium">
                            Head of Accessibility, Nature Conservancy
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
