import Link from "next/link";
import { Suspense } from "react";
import {Logo} from "./logo";
import { getUser } from "@/lib/auth/get-user";
import { HomeMobileMenu } from "./home-mobile-menu";
import { HOME_LINKS, NAV_LINKS } from "@/lib/constants";
import { Button } from "../atoms/button";
import { UserMenu } from "../molecules/user-menu";



function HeaderActions({isLoggedIn}: {isLoggedIn: boolean}) {

  return (
    <div className="flex items-center gap-4">
      <HomeMobileMenu
        links={HOME_LINKS}
        dashboardLinks={NAV_LINKS}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

function UserActionsSkeleton() {
  return <div className="w-24 h-9 bg-muted animate-pulse rounded-full" />;
}

export async function HomeHeader() {
    const user = await getUser();

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

            <div className="hidden md:block">
            {user ? <UserMenu /> : <Link href={'/login'} >
            <Button>
              Start Free
            </Button>
            </Link>}
            </div>

          <Suspense fallback={<UserActionsSkeleton />}>
            <HeaderActions isLoggedIn={!!user} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
