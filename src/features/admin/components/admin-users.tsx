import { getUsers } from "../api";
import { UsersTable } from "./users-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/atoms/card";

export async function AdminUsers() {
  const users = await getUsers();

  return (
    <div className="slide-in-from-bottom-4 flex flex-col flex-1 space-y-8 overflow-y-auto animate-in duration-700 fade-in">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">User Management</h1>
        <p className="mt-1 text-muted-foreground">
          Manage system users and monitor their subscription status.
        </p>
      </div>

      <Card className="flex flex-col flex-1 bg-card/50 backdrop-blur-sm border-border/50 overflow-y-auto">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A total of {users.length} users are registered on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
