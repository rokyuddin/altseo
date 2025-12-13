'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface SaveImageMetadataInput {
  storagePath: string
  fileName: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
}

export async function saveImageMetadata(input: SaveImageMetadataInput) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('images')
      .insert({
        user_id: user.id,
        storage_path: input.storagePath,
        file_name: input.fileName,
        file_size: input.fileSize,
        mime_type: input.mimeType,
        width: input.width,
        height: input.height,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { data }
  } catch (error) {
    console.error('Save metadata error:', error)
    return { error: 'Failed to save image metadata' }
  }
}

export async function getUserImages() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Get images error:', error)
    return { error: 'Failed to fetch images' }
  }
}

export async function updateAltText(imageId: string, altText: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('images')
      .update({ alt_text: altText })
      .eq('id', imageId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { data }
  } catch (error) {
    console.error('Update alt text error:', error)
    return { error: 'Failed to update alt text' }
  }
}
