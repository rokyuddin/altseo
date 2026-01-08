'use server'

import { createClientServer } from '@/lib/supabase/server'
import { contactSchema, type ContactInput } from '../schemas/contact-schema'

export async function submitContactForm(data: ContactInput) {
    const result = contactSchema.safeParse(data)
    if (!result.success) {
        return { error: 'Invalid input' }
    }

    const supabase = await createClientServer()

    const { error } = await supabase.from('contact_submissions').insert(result.data)

    if (error) {
        console.error('Contact form submission error:', error)
        return { error: 'Something went wrong. Please try again later.' }
    }

    return { success: true }
}
