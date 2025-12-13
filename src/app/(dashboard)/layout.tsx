import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { signOut } from "@/lib/auth/actions";
import Link from "next/link";
import { DashboardHeader } from "@/components/organisms/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500 overflow-x-hidden">
      <DashboardHeader user={user} />
      <main className="relative  min-h-[90vh] max-w-5xl mx-auto py-24">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]"></div>
        </div>
        {children}
      </main>
    </div>
  );
}
