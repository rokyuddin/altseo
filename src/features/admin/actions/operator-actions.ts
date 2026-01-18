'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { type PermissionKey } from '@/lib/permissions-types'
import { isAdmin } from '@/lib/admin'

export async function inviteOperator(data: { email: string, role_id: string }) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = createAdminClient()

  // 1. Create auth user (invite)
  const { data: { user }, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(data.email)

  if (inviteError || !user) {
    return { error: inviteError?.message || 'Failed to invite user' }
  }

  // 2. Add to operators table
  const { error: operatorError } = await supabase
    .from('operators')
    .insert({
      auth_user_id: user.id,
      role_id: data.role_id,
      is_active: true
    })

  if (operatorError) {
    // Cleanup auth user if operator creation fails
    await supabase.auth.admin.deleteUser(user.id)
    return { error: operatorError.message }
  }

  // 3. Log audit
  await supabase.from('admin_audit_logs').insert({
    action: 'invite_operator',
    details: { email: data.email, role_id: data.role_id }
  })

  revalidatePath('/admin/operators')
  return { success: true }
}

export async function toggleOperatorStatus(operatorId: string, isActive: boolean) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('operators')
    .update({ is_active: isActive })
    .eq('id', operatorId)

  if (error) {
    return { error: error.message }
  }

  // Log audit
  await supabase.from('admin_audit_logs').insert({
    action: isActive ? 'enable_operator' : 'disable_operator',
    details: { operator_id: operatorId }
  })

  revalidatePath('/admin/operators')
  return { success: true }
}

export async function updateOperatorRole(operatorId: string, roleId: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' }
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('operators')
    .update({ role_id: roleId })
    .eq('id', operatorId)

  if (error) {
    return { error: error.message }
  }

  // Log audit
  await supabase.from('admin_audit_logs').insert({
    action: 'update_operator_role',
    details: { operator_id: operatorId, role_id: roleId }
  })

  revalidatePath('/admin/operators')
  return { success: true }
}
