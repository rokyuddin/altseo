import { AdminSubscriptions } from "@/features/admin/components/admin-subscriptions";
import { Suspense } from "react";
import { Spinner } from "@/components/atoms/spinner";

export default function AdminSubscriptionsPage() {
  return (
    <Suspense fallback={<Spinner className="size-10" containerClassName="flex-1" />}>
      <AdminSubscriptions />
    </Suspense>
  );
}


