import { createClientServer } from '@/lib/supabase/server'
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
    const supabase = await createClientServer()
    const plan = await getUserPlan(userId)

    const limit = plan === 'pro' ? PRO_PLAN_DAILY_LIMIT : FREE_PLAN_DAILY_LIMIT
    const today = new Date().toISOString().split('T')[0]

    // Helper function to perform DB operation with retry potential
    const performCheck = async () => {
      // Get existing record for today
      const { data: existingRecord, error: fetchError } = await supabase
        .from('rate_limits')
        .select('image_count')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      let innerCount = 0

      if (existingRecord) {
        innerCount = existingRecord.image_count
      } else {
        // Try to insert
        const { error: insertError } = await supabase
          .from('rate_limits')
          .insert({ user_id: userId, date: today, image_count: 0 })

        if (insertError) {
          if (insertError.code === '23505') { // Unique violation means race condition, retry fetch
            const { data: retryData } = await supabase
              .from('rate_limits')
              .select('image_count')
              .eq('user_id', userId)
              .eq('date', today)
              .single()

            if (retryData) innerCount = retryData.image_count
          } else {
            throw insertError
          }
        }
      }
      return innerCount
    }

    let count = 0
    let lastError: any = null

    // Simple retry loop (try twice)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        count = await performCheck()
        lastError = null
        break
      } catch (err) {
        lastError = err
        if (attempt === 1) {
          // Wait briefly before retry
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    }

    if (lastError) {
      console.warn('Rate limit check failed after retries (network/db issue):', lastError.message || lastError)
      // Fallback is to allow proceed (fail open)
      return {
        count: 0,
        limit,
        remaining: limit,
        canProceed: true
      }
    }

    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - count)
    const canProceed = limit === Infinity || count < limit

    return {
      count,
      limit,
      remaining,
      canProceed
    }
  } catch (error) {
    console.warn('Rate limit check failed (unexpected):', error)
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
    const supabase = await createClientServer()

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

