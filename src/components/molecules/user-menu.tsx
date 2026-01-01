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
            "rounded-full bg-white/60 hover:bg-white/80 border border-white/40 backdrop-blur-sm",
            className,
          )}
        >
          <UserIcon className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-0">
        <div className="p-4">
          {userEmail && (
            <>
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {userEmail}
              </div>
              <hr className="my-2 border-border" />
            </>
          )}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/upload"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
            <Link
              href="/history"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <History className="h-4 w-4" />
              History
            </Link>
            <Link
              href="/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/api-keys"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Key className="h-4 w-4" />
              API Keys
            </Link>
            <hr className="my-2 border-border" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </PopoverContent>
    </Popover>
  );
}
