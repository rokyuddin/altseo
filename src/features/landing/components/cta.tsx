import Link from "next/link";
import { Button } from "@/components/atoms/button";

export function CTASection() {
    return (
        <section className="py-20 @md:py-32 px-4 @md:px-6 text-center container-section">
            <div className="max-w-3xl mx-auto space-y-6 @md:space-y-8">
                <h2 className="text-4xl @md:text-7xl font-bold text-foreground tracking-tight">
                    Ready to <span className="text-primary italic font-serif">bloom?</span>
                </h2>
                <p className="text-lg @md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                    Join thousands of creators making the web a more welcoming,
                    organic place for everyone.
                </p>
                <div className="pt-6 @md:pt-8 flex flex-col @sm:flex-row justify-center gap-4">
                    <Link href="/register" className="w-full @sm:w-auto">
                        <Button
                            size="lg"
                            className="w-full rounded-full h-14 @md:h-16 px-8 @md:px-12 text-base @md:text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1"
                        >
                            Start Your Free Trial
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full @sm:w-auto">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="w-full rounded-full h-14 @md:h-16 px-8 @md:px-12 text-base @md:text-lg text-foreground hover:bg-muted/50"
                        >
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
