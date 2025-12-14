"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Leaf } from "lucide-react";
import { UserMenu } from "@/components/molecules/user-menu";
import type { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-full px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href={"/"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <Leaf className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold tracking-tight text-lg">AltSEO</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link href="/upload" className="hover:text-primary transition-colors">
            Upload
          </Link>
          <Link
            href="/history"
            className="hover:text-primary transition-colors"
          >
            History
          </Link>
          <Link
            href="/settings"
            className="hover:text-primary transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/api-keys"
            className="hover:text-primary transition-colors"
          >
            API Keys
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          {user && <UserMenu userEmail={user.email} />}
        </div>
      </div>
    </header>
  );
}
