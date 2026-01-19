import { Suspense } from "react";
import { AuditLogs } from "@/features/admin/components/audi-logs";
import { Spinner } from "@/components/atoms/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs | AltSEO Admin",
  description: "Track administrative activities on the platform.",
};

export default function AuditLogsPage() {
  return <Suspense fallback={<Spinner className="size-10" containerClassName="flex-1" />}>
    <AuditLogs />
  </Suspense>
}
