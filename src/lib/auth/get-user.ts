'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserPlan } from '@/lib/subscription'

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function getUserProfile() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return null
    }

    const plan = await getUserPlan(user.id)

    return {
      id: user.id,
      email: user.email,
      plan,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}
