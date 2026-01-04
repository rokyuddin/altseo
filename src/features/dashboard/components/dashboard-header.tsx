"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/organisms/logo";
import { signOut } from "@/features/auth/actions/auth-actions";


export function DashboardHeader() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 md:p-8 container-inline-size">
      <div className="w-full @7xl:max-w-7xl mx-auto bg-card/60 dark:bg-card/20 backdrop-blur-2xl border border-white/40 dark:border-border/20 rounded-full px-4 md:px-8 py-2 md:py-4 flex items-center justify-between shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-all duration-500">
        <Logo />

        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="@lg:hidden rounded-full hover:bg-primary/10">
                <Menu className="size-5 text-primary" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="rounded-l-4xl border-none bg-card/95 backdrop-blur-2xl p-6">
              <SheetHeader className="pb-8">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-all px-4 py-3 rounded-2xl",
                        isActive
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Button
                  variant="destructive"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          <nav className="hidden @lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-all hover:-translate-y-px text-sm font-medium",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              variant="destructive"

              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
