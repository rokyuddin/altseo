import { Suspense } from "react";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import Footer from "@/components/organisms/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-foreground transition-all duration-700">
      {/* Dynamic Background Elements */}
      <div className="-z-10 fixed inset-0 overflow-hidden pointer-events-none">
        <div className="top-[-10%] left-[-10%] absolute bg-primary/5 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow" />
        <div className="right-[-10%] bottom-[-10%] absolute bg-accent/5 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow [animation-delay:2s]" />
      </div>

      <Suspense>
        <DashboardHeader />
      </Suspense>
      <main className="relative mx-auto py-24 md:py-32 max-w-7xl min-h-[90vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
