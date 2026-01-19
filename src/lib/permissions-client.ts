import { createClient } from "./supabase/client";
import { type OperatorMetadata, type PermissionKey } from "./permissions-types";

/**
 * Fetches operator metadata for the current user from the client.
 */
export async function getOperatorMetadataClient(): Promise<OperatorMetadata | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('operators')
      .select(`
      is_active,
      app_roles (
        name,
        role_permissions (
          app_permissions ( key )
        )
      )
    `)
      .eq('auth_user_id', user.id)
      .single();

    // Handle "no rows found" gracefully (user is not an operator)
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching operator metadata:', error);
      return null;
    }

    // Supabase might return single relation as object or array depending on exact setup
    const appRole = Array.isArray(data.app_roles) ? data.app_roles[0] : data.app_roles;

    if (!appRole) {
      return {
        role: '',
        permissions: [],
        isActive: data?.is_active ?? false,
      };
    }

    // Safely extract permissions with robust optional chaining
    // appRole.role_permissions might be: undefined, null, [], or populated array
    const rawStats = appRole.role_permissions || [];

    const rolePerms = rawStats.flatMap((rp: any) =>
      rp?.app_permissions?.key ? [rp.app_permissions.key] : []
    ) as PermissionKey[];

    return {
      role: appRole.name,
      permissions: rolePerms,
      isActive: data?.is_active ?? false,
    };

  } catch (error) {
    console.error('Error fetching operator metadata:', error);
    return null;
  }

}



