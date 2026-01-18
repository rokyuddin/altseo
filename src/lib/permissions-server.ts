import { createClientServer } from "./supabase/server";
import { type OperatorMetadata, type PermissionKey } from "./permissions-types";

/**
 * Fetches operator metadata for the current user from the server.
 */
export async function getOperatorMetadataServer(): Promise<OperatorMetadata | null> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('operators')
    .select(`
      is_active,
      app_roles (
        name,
        role_permissions (
          app_permissions (
            key
          )
        )
      )
    `)
    .eq('auth_user_id', user.id)
    .single();

  if (error || !data) return null;

  const role = data.app_roles as any;
  const permissions = role.role_permissions.map(
    (rp: any) => rp.app_permissions.key
  ) as PermissionKey[];

  return {
    role: role.name,
    permissions,
    isActive: data.is_active,
  };
}
