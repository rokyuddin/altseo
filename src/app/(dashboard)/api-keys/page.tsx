import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/auth";
import { createClientServer } from "@/lib/supabase/server";
import ApiKeysClient from "./client";



export default async function ApiKeysPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect("/login");
  }

  if (profile.plan !== "pro") {
    redirect("/settings");
  }

  const supabase = await createClientServer();
  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <ApiKeysClient initialKeys={apiKeys || []} />;
}
