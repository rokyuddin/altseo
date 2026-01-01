
import { Suspense } from "react";
import { HomeHeader } from "@/components/organisms/home-header";
import Footer from "@/components/organisms/footer";
import { CTASection, DemoSection, FeaturesSection, Hero, MethodologySection, PricingContainer, PricingSkeleton, TestimonialSection } from "@/features/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500 overflow-x-hidden">
      <HomeHeader />

      <main className="container-inline-size">
        <Hero />
        <DemoSection />
        <FeaturesSection />
        <MethodologySection />
        <TestimonialSection />

        <Suspense fallback={<PricingSkeleton />}>
          <PricingContainer />
        </Suspense>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
