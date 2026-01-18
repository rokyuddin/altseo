import { createClientServer } from "./supabase/server";

/**
 * Checks if the current user is an administrator.
 * Admins are identified by:
 * 1. Emails listed in the ADMIN_EMAILS environment variable.
 * 2. Being an active operator in the database.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) return false;

  // 1. Check ADMIN_EMAILS
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((email) =>
      email.trim().toLowerCase(),
    ) || [];

  if (adminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  // 2. Check Operators table
  const { data: operator } = await supabase
    .from('operators')
    .select('is_active')
    .eq('auth_user_id', user.id)
    .single();

  return !!operator?.is_active;
}
