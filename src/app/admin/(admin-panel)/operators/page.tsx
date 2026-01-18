import { getOperators, getRoles } from "@/features/admin/api";
import { OperatorsTable } from "@/features/admin/components/operators-table";
import { InviteOperatorModal } from "@/features/admin/components/invite-operator-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operators Management | AltSEO Admin",
  description: "Manage platform operators and roles.",
};

export default async function OperatorsPage() {
  const [operators, roles] = await Promise.all([
    getOperators(),
    getRoles(),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Operators Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage administrative access and roles for the platform.
          </p>
        </div>
        <InviteOperatorModal roles={roles} />
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>System Operators</CardTitle>
          <CardDescription>
            A list of all users with administrative privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OperatorsTable operators={operators} />
        </CardContent>
      </Card>
    </div>
  );
}
