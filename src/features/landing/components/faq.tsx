export function FAQSection() {
    return (
        <section id="faq" className="bg-secondary/30 px-4 py-24">
            <div className="mx-auto max-w-4xl">
                <h2 className="mb-16 font-bold text-3xl md:text-5xl text-center">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-8">
                    <div className="bg-card shadow-sm p-8 border border-border rounded-2xl">
                        <h3 className="mb-4 font-bold text-xl">How does AltSEO improve my search rankings?</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            By providing search engines with keyword-rich, contextually relevant ALT text, AltSEO helps your images appear in Google Image Search and improves the overall semantic relevance of your pages for your target keywords.
                        </p>
                    </div>
                    <div className="bg-card shadow-sm p-8 border border-border rounded-2xl">
                        <h3 className="mb-4 font-bold text-xl">Is the generated ALT text WCAG compliant?</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Yes, AltSEO is designed to meet WCAG 2.1 accessibility standards. Our AI generates descriptive, non-redundant text that provides meaningful context for users relying on assistive technologies like screen readers.
                        </p>
                    </div>
                    <div className="bg-card shadow-sm p-8 border border-border rounded-2xl">
                        <h3 className="mb-4 font-bold text-xl">Does it work with Next.js &lt;Image /&gt; component?</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Absolutely! AltSEO provides clean string outputs that can be passed directly to the `alt` prop in Next.js or any other frontend framework. It&apos;s built with developers in mind.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
