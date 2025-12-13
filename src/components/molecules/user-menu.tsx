"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Button } from "@/components/atoms/button";
import { signOut } from "@/features/auth/actions/auth-actions";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  userEmail?: string;
  className?: string;
}

export function UserMenu({ userEmail, className }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {userEmail && (
          <>
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {userEmail}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-2 cursor-pointer"
          >
            <History className="h-4 w-4" />
            History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
