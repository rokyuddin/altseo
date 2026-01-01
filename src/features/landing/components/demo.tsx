import Link from "next/link";
import { Button } from "@/components/atoms/button";

export function DemoSection() {
    return (
        <section id="demo" className="py-32 px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                    Try It Now
                </div>
                <h2 className="text-4xl @md:text-6xl font-bold mb-8 text-foreground leading-tight">
                    Experience the Magic
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Upload an image and see how AI transforms it into accessible,
                    SEO-optimized alt text. No signup required to try.
                </p>
                <div className="pt-8">
                    <Link href="/upload">
                        <Button
                            size="lg"
                            className="rounded-full h-16 px-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Upload Your First Image
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
