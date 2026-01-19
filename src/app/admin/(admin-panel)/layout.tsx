import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/atoms/sidebar";
import AdminHeader from "@/features/admin/components/admin-header";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <SidebarProvider>
      <div className="relative flex bg-background w-full min-h-screen font-sans text-foreground">
        {/* Admin Background Elements */}
        {/* Adjusted z-index behavior might be needed with sidebar overlay */}
        <div className="-z-10 fixed inset-0 overflow-hidden pointer-events-none">
          <div className="top-[-10%] right-[-10%] absolute bg-primary/5 blur-[120px] rounded-full w-[40%] h-[40%] animate-pulse-slow" />
          <div className="bottom-[-10%] left-[-5%] absolute bg-accent/5 blur-[120px] rounded-full w-[30%] h-[30%] animate-pulse-slow [animation-delay:3s]" />
        </div>

        <AdminSidebar />

        <SidebarInset>
          <AdminHeader />

          <div className="flex flex-col flex-1 gap-4 p-4 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
