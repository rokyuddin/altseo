
import { Suspense } from "react";
import { HomeHeader } from "@/components/organisms/home-header";
import Footer from "@/components/organisms/footer";
import { CTASection, DemoSection, FeaturesSection, Hero, MethodologySection, PricingContainer, PricingSkeleton, TestimonialSection } from "@/features/landing";
import HomeHeaderSkeleton from "@/components/organisms/home-header-skeleton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500 overflow-x-hidden">
      <Suspense fallback={<HomeHeaderSkeleton />} >
      <HomeHeader />
      </Suspense>

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
