import { Webhook } from '@creem_io/nextjs';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const POST = Webhook({
    webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
    onGrantAccess: async ({ customer, metadata }) => {
        const userId = metadata?.userId as string;
        if (!userId) {
            console.error('No userId found in webhook metadata');
            return;
        }

        console.log("customer", customer);
        console.log("metadata", metadata);

        const supabase = createAdminClient();

        // Update user subscription to Pro
        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                plan_type: 'pro',
                subscription_status: 'active',
                creem_customer_id: customer.id,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) {
            console.error('Error granting access in webhook:', error);
            throw error;
        }

        revalidatePath('/');
        revalidatePath('/dashboard');
    },
    onRevokeAccess: async ({ metadata }) => {
        const userId = metadata?.userId as string;
        if (!userId) {
            console.error('No userId found in webhook metadata');
            return;
        }

        const supabase = createAdminClient();

        // Downgrade user subscription to Free or mark as expired
        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                plan_type: 'free',
                subscription_status: 'expired',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) {
            console.error('Error revoking access in webhook:', error);
            throw error;
        }

        revalidatePath('/');
        revalidatePath('/dashboard');
    },
});
