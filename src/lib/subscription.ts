import { createAdminClient } from "@/lib/supabase/admin";
import { createClientServer } from '@/lib/supabase/server'
import { getUser } from './auth'
import { cacheTag } from "next/cache";

export type PlanType = 'free' | 'pro'

export interface UserSubscription {
  id: string
  user_id: string
  plan_type: PlanType
  subscription_status: 'active' | 'cancelled' | 'expired'
  created_at: string
  updated_at: string
}

async function getCachedUserPlan(userId: string): Promise<PlanType> {
  "use cache"
  cacheTag("user-plan")
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('plan_type')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return 'free'
    }

    return data.plan_type as PlanType
  } catch (error) {
    console.error('Error getting cached user plan:', error)
    return 'free'
  }
}

export const getUserPlan = async (userId: string): Promise<PlanType> => {
  return getCachedUserPlan(userId);
}

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const supabase = await createClientServer()
  try {
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

export async function isCurrentUserPro() {
  const user = await getUser()
  if (!user) {
    return false
  }
  return await isProUser(user.id)
}

export async function canUploadMultiple(userId: string): Promise<boolean> {
  return await isProUser(userId)
}

export async function canUseAPI(userId: string): Promise<boolean> {
  return await isProUser(userId)
}

