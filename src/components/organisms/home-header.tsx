import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { UserMenu } from "@/components/molecules/user-menu";
import { Suspense } from "react";
import {Logo} from "./logo";
import { getUser } from "@/lib/auth/get-user";
import { HomeMobileMenu } from "./home-mobile-menu";
import { HOME_LINKS, NAV_LINKS } from "@/lib/constants";



async function HeaderActions() {
  const user = await getUser();

  return (
    <div className="flex items-center gap-4">
      <Suspense fallback={<UserActionsSkeleton />}>
        {user ? (
          <UserMenu userEmail={user.email} />
        ) : (
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-semibold hover:text-primary hidden sm:block transition-colors"
            >
              Log in
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-semibold shadow-lg shadow-primary/20"
              >
                Start Free
              </Button>
            </Link>
          </div>
        )}
      </Suspense>

      <HomeMobileMenu
        links={HOME_LINKS}
        dashboardLinks={NAV_LINKS}
        isLoggedIn={!!user}
      />
    </div>
  );
}

function UserActionsSkeleton() {
  return <div className="w-24 h-9 bg-muted animate-pulse rounded-full" />;
}

export function HomeHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 md:p-8 container-inline-size">
      <div className="w-full @5xl:max-w-5xl mx-auto bg-card/50 backdrop-blur-xl border border-border/40 rounded-full px-4 md:px-6 py-2 md:py-4 flex items-center justify-between shadow-sm transition-all duration-300">
        <Logo />

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            {HOME_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Suspense fallback={<UserActionsSkeleton />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
