import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { ArrowRight, Leaf, Sparkles, Sun, Wind } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HomeHeader } from "@/components/organisms/home-header";
import { PricingSection } from "@/components/organisms/pricing-section";
import Footer from "@/components/organisms/footer";
import { getUserPlan } from "@/lib/subscription";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userPlan = user ? await getUserPlan(user.id) : 'free';
  const showSuccess = (await searchParams)?.success === 'upgrade';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500 overflow-x-hidden">
      <HomeHeader user={user} />

      <main>
        {/* Hero Section - Organic shapes */}
        <section className="relative px-6 py-40 md:py-48 min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">
          {/* Organic blobs background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 border border-white/50 backdrop-blur-md text-primary font-medium text-sm shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sun className="w-4 h-4" />
              <span>Natural Language for the Visual Web</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              Let your images <br />
              <span className="text-primary italic font-serif">breathe.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Cultivate a more accessible, search-optimized web. Generate
              organic, keyword-rich descriptions that drive discovery while
              ensuring true inclusivity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full h-16 px-12 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Plant the Seed
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full h-16 px-10 text-lg border-2 border-foreground/10 bg-transparent hover:bg-white/50 backdrop-blur-sm text-foreground"
                >
                  Try It Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
            <ArrowRight className="w-6 h-6 rotate-90" />
          </div>
        </section>

        {/* Demo Section - Guest Upload */}
        <section id="demo" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
              Try It Now
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground leading-tight">
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

        {/* Features - Floating Cards */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Naturally Intelligent
              </h2>
              <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                Our system mimics human perception, understanding context and
                emotion to create descriptions that flow naturally.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Leaf,
                  title: "Organic Growth",
                  desc: "Our models adapt to your brand voice, ensuring consistent, high-quality descriptions that scale with your library.",
                  color: "bg-green-100 text-green-700",
                },
                {
                  icon: Wind,
                  title: "Search Engine Harmony",
                  desc: "Boost organic visibility naturally. We weave relevant keywords into semantic narratives that search engines prioritize.",
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  icon: Sun,
                  title: "Accessible Core",
                  desc: "Built from the ground up to nurture inclusivity, ensuring your content reaches every user in the digital ecosystem.",
                  color: "bg-yellow-100 text-yellow-700",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group p-10 rounded-[2.5rem] bg-white border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology - Soft Split */}
        <section
          id="methodology"
          className="py-32 bg-secondary/50 rounded-[4rem] mx-4 md:mx-8"
        >
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/5] rounded-[3rem] bg-white shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                {/* Abstract Nature visual */}
                <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                  <div className="relative">
                    <Leaf className="w-32 h-32 text-primary/40 animate-pulse" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8 px-6 py-3 bg-white/90 backdrop-blur rounded-2xl shadow-sm text-sm font-medium text-foreground whitespace-nowrap">
                      &quot;A vibrant green fern unfolding...&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                Our Process
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground leading-tight">
                From Pixels to <br />
                <span className="text-primary">Poetry.</span>
              </h2>
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Observe",
                    desc: "We ingest your visual assets with the precision of a gallery curator, analyzing composition and context.",
                  },
                  {
                    step: "02",
                    title: "Understand",
                    desc: "Our AI identifies key subjects and emotional nuances, mapping them to relevant search intent.",
                  },
                  {
                    step: "03",
                    title: "Optimize",
                    desc: "We generate rich, WCAG-compliant text that enhances both user experience and search engine visibility.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-bold text-primary shadow-sm shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial - Centered Card */}
        <section className="py-40 px-6">
          <div className="max-w-4xl mx-auto text-center relative">
            <Sparkles className="w-12 h-12 text-accent absolute -top-6 -left-6 animate-pulse" />
            <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100">
              <p className="text-2xl md:text-4xl font-serif italic text-foreground leading-relaxed mb-8">
                &quot;AltSEO brings a human touch to automation. The
                descriptions feel hand-crafted, warm, and surprisingly
                insightful.&quot;
              </p>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mb-4 flex items-center justify-center text-primary font-bold text-xl">
                  S
                </div>
                <div className="font-bold text-foreground">Sarah Jenkins</div>
                <div className="text-sm text-muted-foreground font-medium">
                  Head of Accessibility, Nature Conservancy
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection user={user} userPlan={userPlan} showSuccess={showSuccess} />

        {/* CTA - Full Width */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
              Ready to bloom?
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Join thousands of creators making the web a more welcoming,
              organic place for everyone.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full h-16 px-12 text-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1"
                >
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full h-16 px-12 text-lg text-foreground hover:bg-stone-100"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer - Simple & Clean */}
        <Footer />
      </main>
    </div>
  );
}
