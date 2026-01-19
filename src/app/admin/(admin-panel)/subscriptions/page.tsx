import { AdminSubscriptions } from "@/features/admin/components/admin-subscriptions";
import { Suspense } from "react";
import { Spinner } from "@/components/atoms/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions | AltSEO Admin",
  description: "Manage platform subscriptions.",
};

export default function AdminSubscriptionsPage() {
  return (
    <Suspense fallback={<Spinner className="size-10" containerClassName="flex-1" />}>
      <AdminSubscriptions />
    </Suspense>
  );
}


