import { createClientServer } from '@/lib/supabase/server'
import { getUserPlan } from '@/lib/subscription'

import { cache } from 'react'

export const getUser = cache(async () => {
    try {
        const supabase = await createClientServer()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        return user
    } catch (error) {
        console.error('Error getting user:', error)
        return null
    }
})

export async function getUserProfile() {
    try {
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
    } catch (error) {
        console.error('Error getting user profile:', error)
        return null
    }
}
