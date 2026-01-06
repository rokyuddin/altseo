import { createClientServer } from '@/lib/supabase/server'
import { getUserPlan } from '@/lib/subscription'

import { cache } from 'react'

export const getUser = cache(async () => {
    const supabase = await createClientServer()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
})

export async function getUserProfile() {
    const user = await getUser()

    if (!user) {
        return null
    }

    const plan = await getUserPlan(user.id)

    return {
        id: user.id,
        email: user.email,
        plan,
    }
}
