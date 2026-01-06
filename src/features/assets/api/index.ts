import { getUser } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { cacheTag } from "next/cache"
import { AssetsHistory } from "../types"




async function getCachedAssetsHistory(userId: string): Promise<AssetsHistory[]> {
    "use cache"
    cacheTag('assets-history')
    const supabase = createAdminClient();

    const { data: results, error } = await supabase
        .from("images")
        .select("id, file_name, created_at, alt_text, storage_path")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching results:", error);
        return [];
    }

    return results as AssetsHistory[];
}

async function getAssetsHistory(): Promise<AssetsHistory[]> {
    const user = await getUser()

    if (!user) return [];

    return getCachedAssetsHistory(user.id);
}



export async function getAllAssetsHistory(query?: string, limit: number = 50): Promise<AssetsHistory[]> {
    const user = await getUser()

    if (!user) return [];

    const supabase = createAdminClient();

    let queryBuilder = supabase
        .from("images")
        .select("id, file_name, created_at, alt_text, storage_path")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (query) {
        queryBuilder = queryBuilder.or(`file_name.ilike.%${query}%,alt_text.ilike.%${query}%`);
    }

    const { data: results, error } = await queryBuilder;

    if (error) {
        console.error("Error fetching history:", error);
        return [];
    }

    return results as AssetsHistory[];
}

export { getAssetsHistory };