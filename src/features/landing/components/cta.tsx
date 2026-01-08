import Link from "next/link";
import { Button } from "@/components/atoms/button";

export function CTASection() {
    return (
        <section className="px-4 @md:px-6 py-20 @md:py-32 text-center container-section">
            <div className="space-y-6 @md:space-y-8 mx-auto max-w-3xl">
                <h2 className="font-bold text-foreground text-4xl @md:text-7xl tracking-tight">
                    Scale Your <span className="font-serif text-primary italic">Image SEO.</span>
                </h2>
                <p className="mx-auto max-w-2xl font-light text-muted-foreground text-lg @md:text-xl">
                    Join thousands of developers and teams automating their image accessibility and search rankings.
                </p>
                <div className="flex @sm:flex-row flex-col justify-center gap-4 pt-6 @md:pt-8">
                    <Link href="/register" className="w-full @sm:w-auto">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 shadow-xl px-8 @md:px-12 rounded-full w-full h-14 @md:h-16 text-primary-foreground text-base @md:text-lg transition-all hover:-translate-y-1"
                        >
                            Start Your Free Trial
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full @sm:w-auto">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="hover:bg-muted/50 px-8 @md:px-12 rounded-full w-full h-14 @md:h-16 text-foreground text-base @md:text-lg"
                        >
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
