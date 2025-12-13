'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserPlan } from './subscription'

const FREE_PLAN_DAILY_LIMIT = 10
const PRO_PLAN_DAILY_LIMIT = Infinity

export interface RateLimitStatus {
  count: number
  limit: number
  remaining: number
  canProceed: boolean
}

export async function checkRateLimit(userId: string): Promise<RateLimitStatus> {
  try {
    const supabase = await createClient()
    const plan = await getUserPlan(userId)
    
    const limit = plan === 'pro' ? PRO_PLAN_DAILY_LIMIT : FREE_PLAN_DAILY_LIMIT

    // Get or create rate limit record for today
    const { data: rateLimit, error } = await supabase.rpc('get_or_create_rate_limit', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error checking rate limit:', error)
      // On error, allow the request but log it
      return {
        count: 0,
        limit,
        remaining: limit,
        canProceed: true
      }
    }

    const count = rateLimit?.image_count || 0
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - count)
    const canProceed = limit === Infinity || count < limit

    return {
      count,
      limit,
      remaining,
      canProceed
    }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return {
      count: 0,
      limit: FREE_PLAN_DAILY_LIMIT,
      remaining: FREE_PLAN_DAILY_LIMIT,
      canProceed: true
    }
  }
}

export async function incrementRateLimit(userId: string): Promise<number> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.rpc('increment_rate_limit', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error incrementing rate limit:', error)
      return 0
    }

    return data || 0
  } catch (error) {
    console.error('Error incrementing rate limit:', error)
    return 0
  }
}

export async function getRateLimitStatus(userId: string): Promise<RateLimitStatus> {
  return await checkRateLimit(userId)
}

// Client-side function to get rate limit status
export async function getRateLimitStatusClient(): Promise<RateLimitStatus> {
  const response = await fetch('/api/rate-limit-status')
  if (!response.ok) {
    return {
      count: 0,
      limit: FREE_PLAN_DAILY_LIMIT,
      remaining: FREE_PLAN_DAILY_LIMIT,
      canProceed: true
    }
  }
  return await response.json()
}

