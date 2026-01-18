'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClientServer } from '@/lib/supabase/server'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../schemas/auth-schema'

export async function login(data: LoginInput) {
  const result = loginSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid input' }
  }

  const supabase = await createClientServer()

  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (authError || !user) {
    return { error: authError?.message || 'Login failed' }
  }

  // Check if operator for redirection (as before)
  const { data: operator } = await supabase
    .from('operators')
    .select('is_active')
    .eq('auth_user_id', user.id)
    .single()

  revalidatePath('/', 'layout')
  
  if (operator?.is_active) {
    redirect('/admin')
  }

  redirect('/dashboard')
}

export async function adminLogin(data: LoginInput) {
  console.log("Starting...")
  const result = loginSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid input' }
  }

  console.log("Validating...")

  const supabase = await createClientServer()

  console.log("Creating client...")

  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  console.log(authError)

  if (authError || !user) {
    return { error: authError?.message || 'Login failed' }
  }

  // Verify operator status strictly for admin login
  const { data: operator } = await supabase
    .from('operators')
    .select('is_active')
    .eq('auth_user_id', user.id)
    .single()

  if (!operator?.is_active) {
    await supabase.auth.signOut()
    return { error: 'Access denied. Only platform operators can log in here.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signup(data: RegisterInput) {
  const result = registerSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid input' }
  }

  const supabase = await createClientServer()

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  })

  console.log(error)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClientServer()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
