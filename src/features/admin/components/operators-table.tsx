'use client';

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
  ShieldAlert,
  ShieldCheck,
  Power,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleOperatorStatus } from "../actions/operator-actions";
import { useTransition } from "react";

interface Operator {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface OperatorsTableProps {
  operators: Operator[];
}

export function OperatorsTable({ operators }: OperatorsTableProps) {
  const [isPending, startTransition] = useTransition();

  const onToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleOperatorStatus(id, !currentStatus);
      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px]">Operator</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operators.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No operators found.
              </TableCell>
            </TableRow>
          ) : (
            operators.map((op) => (
              <TableRow
                key={op.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      op.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm truncate max-w-[220px]">
                        {op.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {op.role === 'super_admin' ? (
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {op.role.replace('_', ' ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={op.is_active ? "success" : "secondary"}
                    className="capitalize"
                  >
                    {op.is_active ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(op.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        disabled={isPending}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl"
                    >
                      <DropdownMenuLabel>Operator Actions</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer"
                        onClick={() => onToggleStatus(op.id, op.is_active)}
                      >
                        <Power className={cn("h-4 w-4", op.is_active ? "text-destructive" : "text-success")} />
                        {op.is_active ? "Disable Account" : "Enable Account"}
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

