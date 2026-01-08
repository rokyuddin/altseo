import Link from "next/link";
import { Button } from "@/components/atoms/button";

export function DemoSection() {
    return (
        <section id="demo" className="px-4 py-20 sm:py-28 md:py-32 lg:py-40">
            <div className="space-y-6 xs:space-y-8 mx-auto max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-center">
                <div className="inline-block bg-primary/10 mb-4 px-3 py-1 rounded-full font-bold text-primary text-xs uppercase tracking-widest">
                    Try It Now
                </div>
                <h2 className="mb-6 xs:mb-8 font-bold text-foreground text-3xl sm:text-5xl md:text-6xl leading-tight">
                    See AI ALT Text in Action
                </h2>
                <p className="mx-auto px-2 xs:px-0 max-w-xs sm:max-w-xl md:max-w-2xl text-muted-foreground text-base sm:text-xl leading-relaxed">
                    Upload an image and see how AI transforms it into accessible,
                    SEO-optimized alt text. No signup required to try.
                </p>
                <div className="pt-6 xs:pt-8">
                    <Link href="/assets/upload">
                        <Button
                            size="lg"
                        >
                            Upload Your First Image
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
