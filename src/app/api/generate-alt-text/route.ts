import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageId, storagePath } = body

    if (!imageId && !storagePath) {
      return NextResponse.json(
        { error: 'imageId or storagePath is required' },
        { status: 400 }
      )
    }

    // Get the image URL from Supabase Storage
    let imagePath = storagePath
    if (imageId) {
      const { data: imageData, error: imageError } = await supabase
        .from('images')
        .select('storage_path')
        .eq('id', imageId)
        .eq('user_id', user.id)
        .single()

      if (imageError || !imageData) {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        )
      }
      imagePath = imageData.storage_path
    }

    // Get public URL for the image
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(imagePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get image URL' },
        { status: 500 }
      )
    }

    // Generate alt text using Groq Vision
    const { text } = await generateText({
      model: groq('meta-llama/llama-4-scout-17b-16e-instructl'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Generate a concise, SEO-friendly alt text for this image. The alt text should be descriptive, accessible, and optimized for search engines. Keep it under 125 characters. Only return the alt text, nothing else.',
            },
            {
              type: 'image',
              image: urlData.publicUrl,
            },
          ],
        },
      ],
    })

    // Update the database if imageId was provided
    if (imageId) {
      const { error: updateError } = await supabase
        .from('images')
        .update({ alt_text: text })
        .eq('id', imageId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Failed to update alt text:', updateError)
      }
    }

    console.log('Alt text generated:', text)

    return NextResponse.json({ altText: text })
  } catch (error) {
    console.error('Alt text generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate alt text' },
      { status: 500 }
    )
  }
}
