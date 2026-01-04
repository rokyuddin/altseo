'use server'

import { createClientServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface SaveImageMetadataInput {
  storagePath: string
  fileName: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
  altText?: string
}

export async function saveImageMetadata(input: SaveImageMetadataInput) {
  try {
    const supabase = await createClientServer()
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
        alt_text: input.altText,
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
    const supabase = await createClientServer()
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
    const supabase = await createClientServer()
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

export async function deleteImage(imageId: string, storagePath: string) {
  try {
    const supabase = await createClientServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([storagePath])

    if (storageError) {
      console.error('Storage error:', storageError)
    }

    // 2. Delete from database
    const { error: dbError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('Database error:', dbError)
      return { error: dbError.message }
    }

    revalidatePath('/upload')
    return { success: true }
  } catch (error) {
    console.error('Delete image error:', error)
    return { error: 'Failed to delete image' }
  }
}

