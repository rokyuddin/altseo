import { Logo } from '@/components/organisms/logo'
import { Leaf, CheckCircle2, Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  console.log("auth")

  return (
    <div className="min-h-screen grid md:grid-cols-2 relative overflow-hidden">
      {/* Organic Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Visual Side - Enhanced Organic Natural Theme */}
      <div className="hidden md:flex flex-col justify-between p-12 text-foreground relative overflow-hidden bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5">
        {/* Organic blob shapes background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-accent blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        </div>

        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Logo size="lg" textClassName="text-foreground" />
        </div>
        
        {/* Enhanced Middle Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-10 max-w-md">
          {/* Key Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
                Let your images <span className="text-primary italic">breathe.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
                  className="flex items-center gap-3 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-4 pt-8 border-t border-border/30">
            <blockquote className="space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 text-primary/60 fill-primary/20" />
                ))}
              </div>
              <p className="text-lg leading-relaxed font-serif italic text-foreground/90">
                &ldquo;This tool saves me hours of work every week. The SEO-optimized alt text is a game changer for my content workflow.&rdquo;
              </p>
              <footer className="text-sm text-muted-foreground">
                <span className="font-medium">Sofia Davis</span>
                <span className="mx-2">·</span>
                <span>Content Creator</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
      
      {/* Form Side - Organic Natural */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-background relative min-h-screen">
        {/* Subtle grain texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Logo for mobile view */}
        <div className="mb-8 relative z-10 md:hidden">
          <Logo size="md" />
        </div>
        
        <div className="mx-auto w-full max-w-md space-y-6 flex flex-col items-center justify-center relative z-10 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
