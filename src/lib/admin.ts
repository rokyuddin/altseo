import { unstable_cache } from "next/cache";
import { createClientServer } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";

/**
 * Checks if the current user is an administrator.
 * Admins are identified by:
 * 1. Emails listed in the ADMIN_EMAILS environment variable.
 * 2. Being an active operator in the database.
 * 
 * This function is cached to prevent blocking the entire page render.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return false;

  // Cache the admin check to prevent blocking route errors
  const checkAdminStatus = unstable_cache(
    async (userId: string, userEmail: string) => {
      // 1. Check ADMIN_EMAILS
      const adminEmails =
        process.env.ADMIN_EMAILS?.split(",").map((email) =>
          email.trim().toLowerCase(),
        ) || [];

      if (adminEmails.includes(userEmail.toLowerCase())) {
        return true;
      }

      // 2. Check Operators table using Admin Client (bypasses RLS & cookies)
      const adminSupabase = createAdminClient();
      const { data: operator } = await adminSupabase
        .from('operators')
        .select('is_active')
        .eq('auth_user_id', userId)
        .single();

      return !!operator?.is_active;
    },
    ['admin-check'],
    {
      revalidate: 60, // Cache for 60 seconds
      tags: [`admin-${user.id}`],
    }
  );

  return checkAdminStatus(user.id, user.email);
}
