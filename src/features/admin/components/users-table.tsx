"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Badge } from "@/components/atoms/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Button } from "@/components/atoms/button";
import {
  MoreHorizontal,
  User as UserIcon,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface User {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | undefined;
  plan_type: string;
  subscription_status: string;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[250px]">User</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No users found.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-primary/10 rounded-full w-8 h-8 text-primary">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="max-w-[180px] font-medium text-sm truncate">
                      {user.email || "Unknown"}
                    </span>
                    <span className="max-w-[180px] font-mono text-[10px] text-muted-foreground truncate">
                      {user.id}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(user.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {user.last_sign_in_at
                  ? format(new Date(user.last_sign_in_at), "MMM d, HH:mm")
                  : "Never"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.plan_type === "pro" ? "default" : "outline"}
                  className="capitalize"
                >
                  {user.plan_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.subscription_status === "active"
                      ? "success"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {user.subscription_status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 w-8 h-8"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl w-48"
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Mail className="w-4 h-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Manage
                      Plan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
