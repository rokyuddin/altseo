import { use } from "react";
import { getSubscriptionDetails } from "../api";
import { SubscriptionsTable } from "./subscriptions-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/atoms/card";

export function AdminSubscriptions() {
  const subscriptions = use(getSubscriptionDetails())

  return (
    <div className="slide-in-from-bottom-4 flex flex-col flex-1 space-y-8 overflow-y-auto animate-in duration-700 fade-in">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Subscription Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Monitor payment statuses and manage user plan levels.
        </p>
      </div>

      <Card className="flex flex-col flex-1 bg-card/50 backdrop-blur-sm border-border/50 overflow-y-auto">
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
