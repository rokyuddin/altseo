import { Metadata } from "next";
import { Suspense } from "react";
import { Spinner } from "@/components/atoms/spinner";
import { OperatorsView } from "@/features/admin/components/operators-view";

export const metadata: Metadata = {
  title: "Operators Management | AltSEO Admin",
  description: "Manage platform operators and roles.",
};

export default async function OperatorsPage() {
  return (
    <Suspense fallback={<Spinner className="size-10" containerClassName="flex-1" />}>
      <OperatorsView />
    </Suspense>
  )
}
