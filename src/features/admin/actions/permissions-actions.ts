'use server';

import { createClientServer } from "@/lib/supabase/server";
import { getOperatorMetadataServer } from "@/lib/permissions-server";
import { revalidateTag } from "next/cache";

// Type definitions
export interface Permission {
    id: string;
    key: string;
}

export async function getPermissions() {
    const supabase = await createClientServer();
    const { data, error } = await supabase
        .from('app_permissions')
        .select('*')
        .order('key');

    if (error) {
        console.error('Error fetching permissions:', error);
        return [];
    }

    return data as Permission[];
}

export async function createPermission(key: string) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();
    const { error } = await supabase
        .from('app_permissions')
        .insert([{ key }]);

    if (error) {
        console.error('Error creating permission:', error);
        return { error: error.message };
    }

    revalidateTag('permissions', 'max');
    // revalidatePath('/admin/settings');
    return { success: true };
}

export async function updatePermission(id: string, key: string) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();
    const { error } = await supabase
        .from('app_permissions')
        .update({ key })
        .eq('id', id);

    if (error) {
        console.error('Error updating permission:', error);
        return { error: error.message };
    }

    revalidateTag('permissions', 'max');
    // revalidatePath('/admin/settings');
    return { success: true };
}

export async function deletePermission(id: string) {
    const meta = await getOperatorMetadataServer();
    if (meta?.role !== 'super_admin') {
        return { error: 'Unauthorized' };
    }

    const supabase = await createClientServer();
    const { error } = await supabase
        .from('app_permissions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting permission:', error);
        return { error: error.message };
    }

    revalidateTag('permissions', 'max');
    // revalidatePath('/admin/settings');
    return { success: true };
}