import { AdminSubscriptions } from "@/features/admin/components/admin-subscriptions";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/skeleton";

export default function AdminSubscriptionsPage() {
  return (
    <Suspense fallback={<AdminSubscriptionsSkeleton />}>
      <AdminSubscriptions />
    </Suspense>
  );
}

function AdminSubscriptionsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  );
}
