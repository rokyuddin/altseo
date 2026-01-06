import { getUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Result } from "../types";
import { cacheLife } from "next/cache";




async function getCachedRecentResults(userId: string): Promise<Result[]> {
    "use cache"
    cacheLife('weeks')
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

    return results as Result[];
}

async function getRecentResults(): Promise<Result[]> {
    const user = await getUser()

    if (!user) return [];

    return getCachedRecentResults(user.id);
}

export { getRecentResults };