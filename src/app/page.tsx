
import { Suspense } from "react";
import { HomeHeader } from "@/components/organisms/home-header";
import Footer from "@/components/organisms/footer";
import { CTASection, FAQSection, FeaturesSection, Hero, MethodologySection, PricingContainer, PricingSkeleton, TestimonialSection } from "@/features/landing";
import HomeHeaderSkeleton from "@/components/organisms/home-header-skeleton";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AltSEO",
  "operatingSystem": "Web",
  "applicationCategory": "SEO Tool",
  "description": "Automated ALT text generation and image SEO optimization tool for developers and SaaS founders.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AltSEO improve search rankings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By providing search engines with keyword-rich, contextually relevant ALT text, AltSEO helps your images appear in Google Image Search and improves overall semantic relevance."
      }
    },
    {
      "@type": "Question",
      "name": "Is the ALT text WCAG compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, AltSEO is designed to meet WCAG 2.1 accessibility standards by creating descriptions that provide meaningful context for users relying on assistive technologies."
      }
    }
  ]
};

export default function Home() {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden font-sans text-foreground transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<HomeHeaderSkeleton />} >
        <HomeHeader />
      </Suspense>

      <main className="container-inline-size">
        <Hero />
        <FeaturesSection />
        <MethodologySection />
        <TestimonialSection />

        <Suspense fallback={<PricingSkeleton />}>
          <PricingContainer />
        </Suspense>

        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
