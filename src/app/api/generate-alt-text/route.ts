import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, incrementRateLimit } from '@/lib/rate-limit'
import { createHash } from 'crypto'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Sanitize AI response
function sanitizeText(text: string): string {
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '')
  // Remove script tags and content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Remove potentially harmful characters
  sanitized = sanitized.replace(/[<>]/g, '')
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, 500)
  return sanitized
}

// Get user from Bearer token or session
async function getUserFromRequest(request: NextRequest, supabase: ReturnType<typeof createClient>) {
  // Check for Bearer token
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const apiKey = authHeader.substring(7)
    const apiKeyHash = createHash('sha256').update(apiKey).digest('hex')
    
    // Find API key in database
    const { data: apiKeyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id, key_hash, id')
      .eq('key_hash', apiKeyHash)
      .is('revoked_at', null)
      .single()

    if (keyError || !apiKeyData) {
      return { error: 'Invalid API key', status: 401 }
    }

    // Check if user is Pro
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_type')
      .eq('user_id', apiKeyData.user_id)
      .single()

    if (subscription?.plan_type !== 'pro') {
      return { error: 'API access requires Pro subscription', status: 403 }
    }

    // Update last used
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyData.id)

    return { user: { id: apiKeyData.user_id }, isApiKey: true, apiKeyId: apiKeyData.id }
  }

  // Fall back to session auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  return { user, isApiKey: false }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { imageId, storagePath, variant = 'default', isGuest = false } = body

    // For guest users, allow generation without auth but don't save to DB
    if (isGuest && storagePath && (storagePath.startsWith('blob:') || storagePath.startsWith('data:'))) {
      // Guest user with blob/data URL - need to convert to base64 for API
      // Note: Groq API needs a publicly accessible URL or base64 data URL
      // For blob URLs, we'll need the client to convert to base64 first
      // For now, we'll accept data URLs directly
      let imageUrl = storagePath
      
      // If it's a blob URL, we can't use it server-side - return error
      if (storagePath.startsWith('blob:')) {
        return NextResponse.json(
          { error: 'Blob URLs cannot be processed server-side. Please convert to base64 data URL.' },
          { status: 400 }
        )
      }
      
      // Generate alt text using Groq Vision
      const prompts = {
        default: 'Generate a concise, SEO-friendly alt text for this image. The alt text should be descriptive, accessible, and optimized for search engines. Keep it under 125 characters. Only return the alt text, nothing else.',
        seo: 'Generate an SEO-optimized alt text for this image. Include relevant keywords naturally while maintaining accessibility. The description should be descriptive and help with search engine visibility. Keep it under 125 characters. Only return the alt text, nothing else.',
        long: 'Generate a detailed, comprehensive description of this image. This should be a longer description suitable for detailed image descriptions. Keep it under 300 characters. Only return the description, nothing else.',
        accessibility: 'Generate an accessibility-focused alt text for this image. Prioritize clarity and descriptive detail that would help someone using a screen reader understand the image content fully. Keep it under 200 characters. Only return the alt text, nothing else.',
      }

      const prompt = prompts[variant as keyof typeof prompts] || prompts.default

      const { text } = await generateText({
        model: groq('meta-llama/llama-4-scout-17b-16e-instructl'),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image',
                image: imageUrl,
              },
            ],
          },
        ],
      })

      const sanitizedText = sanitizeText(text)
      return NextResponse.json({ altText: sanitizedText, guest: true })
    }

    // For authenticated users, proceed with normal flow
    const authResult = await getUserFromRequest(request, supabase)

    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 })
    }

    const { user, isApiKey, apiKeyId } = authResult

    if (!imageId && !storagePath) {
      return NextResponse.json(
        { error: 'imageId or storagePath is required' },
        { status: 400 }
      )
    }

    // Check rate limit (only for non-API key requests or if API key user is not pro)
    if (!isApiKey) {
      const rateLimitStatus = await checkRateLimit(user.id)
      if (!rateLimitStatus.canProceed) {
        return NextResponse.json(
          { 
            error: `Daily limit reached (${rateLimitStatus.limit} images). Upgrade to Pro for unlimited generations.`,
            limit: rateLimitStatus.limit,
            count: rateLimitStatus.count
          },
          { status: 429 }
        )
      }
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

    // Check cache first
    const { data: cached } = await supabase
      .from('generation_cache')
      .select('alt_text')
      .eq('storage_path', imagePath)
      .eq('variant', variant)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (cached?.alt_text) {
      // Log API request if using API key
      if (isApiKey && apiKeyId) {
        await supabase.from('api_request_logs').insert({
          user_id: user.id,
          api_key_id: apiKeyId,
          endpoint: '/api/generate-alt-text',
          method: 'POST',
          status_code: 200,
        })
      }
      
      return NextResponse.json({ altText: cached.alt_text, cached: true })
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

    // Generate prompt based on variant
    const prompts = {
      default: 'Generate a concise, SEO-friendly alt text for this image. The alt text should be descriptive, accessible, and optimized for search engines. Keep it under 125 characters. Only return the alt text, nothing else.',
      seo: 'Generate an SEO-optimized alt text for this image. Include relevant keywords naturally while maintaining accessibility. The description should be descriptive and help with search engine visibility. Keep it under 125 characters. Only return the alt text, nothing else.',
      long: 'Generate a detailed, comprehensive description of this image. This should be a longer description suitable for detailed image descriptions. Keep it under 300 characters. Only return the description, nothing else.',
      accessibility: 'Generate an accessibility-focused alt text for this image. Prioritize clarity and descriptive detail that would help someone using a screen reader understand the image content fully. Keep it under 200 characters. Only return the alt text, nothing else.',
    }

    const prompt = prompts[variant as keyof typeof prompts] || prompts.default

    // Generate alt text using Groq Vision
    const { text } = await generateText({
      model: groq('meta-llama/llama-4-scout-17b-16e-instructl'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image',
              image: urlData.publicUrl,
            },
          ],
        },
      ],
    })

    // Sanitize the response
    const sanitizedText = sanitizeText(text)

    // Cache the result (expires in 30 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    
    await supabase.from('generation_cache').insert({
      storage_path: imagePath,
      alt_text: sanitizedText,
      variant,
      expires_at: expiresAt.toISOString(),
    }).onConflict('storage_path,variant').merge()

    // Update the database if imageId was provided
    if (imageId) {
      const { error: updateError } = await supabase
        .from('images')
        .update({ alt_text: sanitizedText })
        .eq('id', imageId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Failed to update alt text:', updateError)
      }
    }

    // Increment rate limit for non-API requests
    if (!isApiKey) {
      await incrementRateLimit(user.id)
    }

    // Log API request if using API key
    if (isApiKey && apiKeyId) {
      await supabase.from('api_request_logs').insert({
        user_id: user.id,
        api_key_id: apiKeyId,
        endpoint: '/api/generate-alt-text',
        method: 'POST',
        status_code: 200,
      })
    }

    return NextResponse.json({ altText: sanitizedText })
  } catch (error) {
    console.error('Alt text generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate alt text' },
      { status: 500 }
    )
  }
}
