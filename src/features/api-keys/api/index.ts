import { getUser } from "@/lib/auth";
import { ApiKey } from "../types";
import { cacheTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";


async function getCachedApiKeys(userId: string): Promise<ApiKey[]> {
    "use cache"
    cacheTag('api-keys')
    const supabase = createAdminClient();

    const { data: results, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", userId)
        .is("revoked_at", null)
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching results:", error);
        return [];
    }

    return results as ApiKey[];
}


export async function getApiKeys(): Promise<ApiKey[]> {
    const user = await getUser();
    if (!user) return [];

    return getCachedApiKeys(user.id);
}
