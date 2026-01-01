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
import { Logo } from "./logo";

interface HomeMobileMenuProps {
    links: { href: string; label: string }[];
    dashboardLinks: { href: string; label: string }[];
    isLoggedIn: boolean;
}

export function HomeMobileMenu({
    links,
    dashboardLinks,
    isLoggedIn,
}: HomeMobileMenuProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full hover:bg-primary/10"
                >
                    <Menu className="size-5 text-primary" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="rounded-l-4xl border-none bg-card/95 backdrop-blur-2xl p-6"
            >
                <SheetHeader className="pb-8">
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8">
                    <nav className="flex flex-col gap-2">
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Menu
                        </h3>
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-2xl"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {isLoggedIn && (
                        <nav className="flex flex-col gap-2">
                            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Dashboard
                            </h3>
                            {dashboardLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-2xl"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {!isLoggedIn && (
                        <div className="pt-4 border-t border-border/40">
                            <Link
                                href="/login"
                                className="text-lg font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-2xl block"
                            >
                                Log in
                            </Link>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
