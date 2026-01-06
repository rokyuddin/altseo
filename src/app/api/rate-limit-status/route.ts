import { NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET() {
  const supabase = await createClientServer()
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = await checkRateLimit(user.id)
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error getting rate limit status:', error)
    return NextResponse.json(
      { error: 'Failed to get rate limit status' },
      { status: 500 }
    )
  }
}

