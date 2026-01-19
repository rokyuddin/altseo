import { AdminUsers } from "@/features/admin/components/admin-users";
import { Suspense } from "react";
import { Spinner } from "@/components/atoms/spinner";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<Spinner className="size-10" containerClassName="flex-1" />}>
      <AdminUsers />
    </Suspense>
  );
}
