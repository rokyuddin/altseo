import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      {/* Admin Background Elements */}
      <div className="-z-10 fixed inset-0 overflow-hidden pointer-events-none">
        <div className="top-[-10%] right-[-10%] absolute bg-primary/5 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow" />
        <div className="left-[-5%] bottom-[-10%] absolute bg-accent/5 blur-[120px] rounded-full w-[30%] h-[30%] animate-pulse-slow [animation-delay:3s]" />
      </div>

      <AdminSidebar />

      <main className="pl-64 flex flex-col min-h-screen">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
