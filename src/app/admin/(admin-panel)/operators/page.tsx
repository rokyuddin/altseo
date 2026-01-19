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
    <div className="slide-in-from-bottom-4 flex flex-col flex-1 space-y-8 overflow-y-auto animate-in duration-700 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Operators Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage administrative access and roles for the platform.
          </p>
        </div>
        <InviteOperatorModal roles={roles} />
      </div>

      <Card className="flex flex-col flex-1 bg-card/50 backdrop-blur-sm border-border/50 overflow-y-auto">
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
