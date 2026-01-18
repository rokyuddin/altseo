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
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
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
                <TableCell className="font-mono text-xs text-muted-foreground">
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
                <TableCell className="text-sm font-mono text-muted-foreground/60">
                  {sub.creem_customer_id || "N/A"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(sub.updated_at), "MMM d, HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl"
                    >
                      <DropdownMenuLabel>Integration</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <ExternalLink className="h-4 w-4" /> View in Creem
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <RefreshCw className="h-4 w-4" /> Force Sync
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
