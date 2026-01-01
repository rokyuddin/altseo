import Link from "next/link";
import { Button } from "@/components/atoms/button";

export function DemoSection() {
    return (
        <section id="demo" className="py-20 sm:py-28 md:py-32 lg:py-40 px-4">
            <div className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-center space-y-6 xs:space-y-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                    Try It Now
                </div>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 xs:mb-8 text-foreground leading-tight">
                    Experience the Magic
                </h2>
                <p className="text-base sm:text-xl text-muted-foreground max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2 xs:px-0">
                    Upload an image and see how AI transforms it into accessible,
                    SEO-optimized alt text. No signup required to try.
                </p>
                <div className="pt-6 xs:pt-8">
                    <Link href="/upload">
                        <Button
                            size="lg"
                            className="w-full xs:w-auto rounded-full h-10 md:h-16 px-6 md:px-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Upload Your First Image
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
