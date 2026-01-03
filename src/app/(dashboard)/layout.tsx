import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import Footer from "@/components/organisms/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen text-foreground font-sans transition-all duration-700 overflow-x-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow [animation-delay:2s]" />
      </div>

      <DashboardHeader />
      <main className="relative min-h-[90vh] max-w-7xl mx-auto py-24 md:py-32">
        {children}
      </main>
      <Footer />
    </div>
  );
}
