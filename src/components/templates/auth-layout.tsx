import { Logo } from '@/components/organisms/logo'
import { Leaf, CheckCircle2, Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid md:grid-cols-2 min-h-screen overflow-hidden">
      {/* Organic Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="top-0 left-0 absolute opacity-[0.03] dark:opacity-[0.05] w-full h-full">
          <div className="top-1/4 -left-1/4 absolute bg-primary blur-3xl rounded-full w-[600px] h-[600px] animate-pulse-slow" />
          <div className="-right-1/4 bottom-1/4 absolute bg-accent blur-3xl rounded-full w-[500px] h-[500px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="top-1/2 right-1/4 absolute bg-secondary blur-3xl rounded-full w-[400px] h-[400px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Visual Side - Enhanced Organic Natural Theme */}
      <div className="hidden relative md:flex flex-col justify-between bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 p-12 overflow-hidden text-foreground">
        {/* Organic blob shapes background */}
        <div className="absolute inset-0 opacity-10">
          <div className="top-20 -left-20 absolute bg-primary blur-3xl rounded-full w-96 h-96" />
          <div className="-right-20 bottom-20 absolute bg-accent blur-3xl rounded-full w-80 h-80" />
          <div className="top-1/2 left-1/4 absolute bg-secondary blur-3xl rounded-full w-64 h-64" />
        </div>

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="z-10 relative">
          <Logo size="lg" textClassName="text-foreground" />
        </div>

        {/* Enhanced Middle Content */}
        <div className="z-10 relative flex flex-col flex-1 justify-center space-y-10 max-w-md">
          {/* Key Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif font-semibold text-foreground text-3xl tracking-tight">
                Let your images <span className="text-primary italic">breathe.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Generate organic, keyword-rich descriptions that drive discovery while ensuring true inclusivity.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: Leaf, text: 'Natural language descriptions' },
                { icon: CheckCircle2, text: 'SEO-optimized content' },
                { icon: Sparkles, text: 'WCAG-compliant accessibility' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-full w-10 h-10 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground/90">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-4 pt-8 border-border/30 border-t">
            <blockquote className="space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="fill-primary/20 w-4 h-4 text-primary/60" />
                ))}
              </div>
              <p className="font-serif text-foreground/90 text-lg italic leading-relaxed">
                &ldquo;This tool saves me hours of work every week. The SEO-optimized alt text is a game changer for my content workflow.&rdquo;
              </p>
              <footer className="text-muted-foreground text-sm">
                <span className="font-medium">Sofia Davis</span>
                <span className="mx-2">·</span>
                <span>Content Creator</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Form Side - Organic Natural */}
      <div className="relative flex flex-col justify-center items-center bg-background p-8 md:p-12 min-h-screen">
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo for mobile view */}
        <div className="md:hidden z-10 relative mb-8">
          <Logo size="md" />
        </div>

        <div className="z-10 relative flex flex-col flex-1 justify-center items-center space-y-6 mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
