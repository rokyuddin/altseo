import Link from "next/link";
import { Button } from "@/components/atoms/button";

export function CTASection() {
    return (
        <section className="py-32 px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-5xl @md:text-7xl font-bold text-foreground tracking-tight">
                    Ready to bloom?
                </h2>
                <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                    Join thousands of creators making the web a more welcoming,
                    organic place for everyone.
                </p>
                <div className="pt-8 flex flex-col @sm:flex-row justify-center gap-4">
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="rounded-full h-16 px-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1"
                        >
                            Start Your Free Trial
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="rounded-full h-16 px-12 text-lg text-foreground hover:bg-muted/50"
                        >
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
