'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createHash, randomBytes } from 'crypto'
import { isProUser } from '@/lib/subscription'

export async function generateApiKey(name?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Check if user is Pro
    const isPro = await isProUser(user.id)
    if (!isPro) {
      return { error: 'API keys are only available for Pro users' }
    }

    // Generate API key
    const apiKey = `altseo_${randomBytes(32).toString('hex')}`
    const keyHash = createHash('sha256').update(apiKey).digest('hex')

    // Store in database
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_hash: keyHash,
        name: name || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      return { error: 'Failed to create API key' }
    }

    revalidatePath('/dashboard/settings')
    return { key: apiKey, data }
  } catch (error) {
    console.error('Generate API key error:', error)
    return { error: 'Failed to generate API key' }
  }
}

export async function revokeApiKey(keyId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Revoke the key
    const { error } = await supabase
      .from('api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', keyId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error revoking API key:', error)
      return { error: 'Failed to revoke API key' }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Revoke API key error:', error)
    return { error: 'Failed to revoke API key' }
  }
}

