
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function finalizeAdmin(email: string, pass: string) {
  console.log(`Finalizing admin for: ${email}...`)

  // 1. Get user ID
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError.message)
    return
  }
  const user = listData.users.find(u => u.email === email)
  if (!user) {
    console.error('User not found.')
    return
  }
  const userId = user.id
  console.log(`Found user ID: ${userId}`)

  // 2. Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    password: pass
  })
  if (updateError) {
    console.error('Error updating password:', updateError.message)
    return
  }
  console.log('Password updated successfully.')

  // 3. Ensure super_admin role
  const { data: roleData } = await supabase
    .from('app_roles')
    .select('id')
    .eq('name', 'super_admin')
    .single()

  if (!roleData) {
    console.error('Super admin role not found in database.')
    return
  }

  // 4. Upsert operator record
  const { error: operatorError } = await supabase
    .from('operators')
    .upsert({
      auth_user_id: userId,
      role_id: roleData.id,
      is_active: true
    }, { onConflict: 'auth_user_id' })

  if (operatorError) {
    console.error('Error with operator record:', operatorError.message)
    return
  }

  console.log('Admin finalized successfully!')
}

finalizeAdmin('rokyuddin.dev@gmail.com', '123456')
