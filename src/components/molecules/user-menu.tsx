"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Upload,
  Key,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Button } from "@/components/atoms/button";
import { signOut } from "@/features/auth/actions/auth-actions";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  userEmail?: string;
  className?: string;
}

export function UserMenu({ userEmail, className }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.refresh();
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/40 rounded-full",
            className,
          )}
        >
          <UserIcon className="w-5 h-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-56">
        <div className="p-4">
          {userEmail && (
            <>
              <div className="px-2 py-1.5 text-muted-foreground text-sm">
                {userEmail}
              </div>
              <hr className="my-2 border-border" />
            </>
          )}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="flex items-center gap-2 hover:bg-accent px-2 py-2 rounded-sm text-sm transition-colors hover:text-accent-foreground"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/assets/upload"
              onClick={handleLinkClick}
              className="flex items-center gap-2 hover:bg-accent px-2 py-2 rounded-sm text-sm transition-colors hover:text-accent-foreground"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Link>
            <Link
              href="/assets/history"
              onClick={handleLinkClick}
              className="flex items-center gap-2 hover:bg-accent px-2 py-2 rounded-sm text-sm transition-colors hover:text-accent-foreground"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <Link
              href="/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-2 hover:bg-accent px-2 py-2 rounded-sm text-sm transition-colors hover:text-accent-foreground"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link
              href="/api-keys"
              onClick={handleLinkClick}
              className="flex items-center gap-2 hover:bg-accent px-2 py-2 rounded-sm text-sm transition-colors hover:text-accent-foreground"
            >
              <Key className="w-4 h-4" />
              API Keys
            </Link>
            <hr className="my-2 border-border" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 hover:bg-destructive/10 px-2 py-2 rounded-sm w-full text-destructive hover:text-destructive text-sm text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </PopoverContent>
    </Popover>
  );
}
