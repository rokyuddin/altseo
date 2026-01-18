import { getSubscriptionDetails } from "../api";
import { SubscriptionsTable } from "./subscriptions-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/atoms/card";

export async function AdminSubscriptions() {
  const subscriptions = await getSubscriptionDetails();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Subscription Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor payment statuses and manage user plan levels.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Active & Recent Subscriptions</CardTitle>
          <CardDescription>
            Details of all subscription records synchronized from Creem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable subscriptions={subscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}
