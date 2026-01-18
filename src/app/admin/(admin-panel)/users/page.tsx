import { AdminUsers } from "@/features/admin/components/admin-users";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/skeleton";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsers />
    </Suspense>
  );
}

function AdminUsersSkeleton() {
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
