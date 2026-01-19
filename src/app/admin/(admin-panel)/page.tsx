import { AdminOverview } from "@/features/admin/components/admin-overview";
import { Suspense } from "react";
import { Spinner } from "@/components/atoms/spinner";

export default function AdminPage() {
  return (
    <Suspense fallback={<Spinner className="size-10" containerClassName="flex-1" />}>
      <AdminOverview />
    </Suspense>
  );
}

