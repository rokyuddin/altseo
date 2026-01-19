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
import { MoreHorizontal, ExternalLink, RefreshCw } from "lucide-react";

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  subscription_status: string;
  creem_customer_id?: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Customer ID</TableHead>
          <TableHead>Last Sync</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No subscriptions found.
            </TableCell>
          </TableRow>
        ) : (
          subscriptions.map((sub) => (
            <TableRow
              key={sub.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-mono text-muted-foreground text-xs">
                {sub.user_id}
              </TableCell>
              <TableCell>
                <Badge
                  variant={sub.plan_type === "pro" ? "default" : "outline"}
                  className="capitalize"
                >
                  {sub.plan_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    sub.subscription_status === "active"
                      ? "success"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {sub.subscription_status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-muted-foreground/60 text-sm">
                {sub.creem_customer_id || "N/A"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(sub.updated_at), "MMM d, HH:mm")}
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
                    <DropdownMenuLabel>Integration</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <ExternalLink className="w-4 h-4" /> View in Creem
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <RefreshCw className="w-4 h-4" /> Force Sync
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
