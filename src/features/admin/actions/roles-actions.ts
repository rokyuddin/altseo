'use server';

import { createClientServer } from "@/lib/supabase/server";
import { getOperatorMetadataServer } from "@/lib/permissions-server";
import { revalidatePath, revalidateTag } from "next/cache";

// Type definitions
export interface Role {
    id: string;
    name: string;
    permissions?: string[]; // IDs of permissions or Keys? Let's return objects if possible, or just keys if that's what we display.
    // Actually, for editing, we usually want permission IDs or Keys.
    // The 'permissions' table uses keys. 'role_permissions' links IDs.
}

export interface RoleWithPermissions extends Role {
    assignedPermissionIds: string[];
}

export async function getRoles(): Promise<RoleWithPermissions[]> {
    const supabase = await createClientServer();
    const { data, error } = await supabase
        .from('app_roles')
        .select(`
      id,
      name,
      role_permissions (
        permission_id
      )
    `)
        .order('name');

    if (error) {
        console.error('Error fetching roles:', error);
        return [];
    }

    // Transform data to flat structure
    return data.map((role: any) => ({
        id: role.id,
        name: role.name,
        assignedPermissionIds: role.role_permissions.map((rp: any) => rp.permission_id),
    }));
}

export async function createRole(name: string) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();
    const { error } = await supabase
        .from('app_roles')
        .insert([{ name }]);

    if (error) {
        console.error('Error creating role:', error);
        return { error: error.message };
    }

    revalidateTag('roles', 'max');
    return { success: true };
}

export async function updateRole(id: string, name: string) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();
    const { error } = await supabase
        .from('app_roles')
        .update({ name })
        .eq('id', id);

    if (error) {
        console.error('Error updating role:', error);
        return { error: error.message };
    }

    revalidateTag('roles', 'max');
    return { success: true };
}

export async function deleteRole(id: string) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();
    const { error } = await supabase
        .from('app_roles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting role:', error);
        return { error: error.message };
    }

    revalidateTag('roles', 'max');
    return { success: true };
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();

    // Transaction-like approach:
    // 1. Delete existing permissions for this role
    // 2. Insert new permissions
    // Note: RPC would be better for atomicity, but client side operations in sequence is acceptable for this scale if errors are handled.
    // Actually, if we delete and insert fails, we lose permissions.
    // Supabase doesn't support complex transactions via JS client easily without RPC.
    // We'll try to do it carefully.

    // 1. Delete
    const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

    if (deleteError) {
        console.error('Error clearing role permissions:', deleteError);
        return { error: deleteError.message };
    }

    if (permissionIds.length > 0) {
        const records = permissionIds.map(pid => ({
            role_id: roleId,
            permission_id: pid
        }));

        const { error: insertError } = await supabase
            .from('role_permissions')
            .insert(records);

        if (insertError) {
            console.error('Error assigning role permissions:', insertError);
            return { error: insertError.message };
        }
    }

    revalidateTag('roles', 'max');
    return { success: true };
}
