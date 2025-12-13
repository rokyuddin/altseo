'use server'

import { createClient } from '@/lib/supabase/server'

export type PlanType = 'free' | 'pro'

export interface UserSubscription {
  id: string
  user_id: string
  plan_type: PlanType
  subscription_status: 'active' | 'cancelled' | 'expired'
  created_at: string
  updated_at: string
}

export async function getUserPlan(userId: string): Promise<PlanType> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('plan_type')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      // Default to free if no subscription found
      return 'free'
    }

    return data.plan_type as PlanType
  } catch (error) {
    console.error('Error getting user plan:', error)
    return 'free'
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return data as UserSubscription
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}

export async function isProUser(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  return plan === 'pro'
}

export async function canUploadMultiple(userId: string): Promise<boolean> {
  return await isProUser(userId)
}

export async function canUseAPI(userId: string): Promise<boolean> {
  return await isProUser(userId)
}

