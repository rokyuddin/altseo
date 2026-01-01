import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import Footer from "@/components/organisms/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen  text-foreground font-sans transition-colors duration-500 overflow-x-hidden">
      <DashboardHeader />
      <main className="relative  min-h-[90vh] max-w-5xl mx-auto py-24">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]"></div>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
}
