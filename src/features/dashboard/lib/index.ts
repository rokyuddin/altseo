import { getUser } from "@/lib/auth";
import { createClientServer } from "@/lib/supabase/server";
import { Result } from "../types";




async function getRecentResults(): Promise<Result[]> {
    const supabase = await createClientServer();

    const user = await getUser()

    if (!user) return [];

    const { data: results, error } = await supabase
        .from("images")
        .select("id, file_name, created_at, alt_text, storage_path")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {
        console.error("Error fetching results:", error);
        return [];
    }

    return results;
}

export { getRecentResults };