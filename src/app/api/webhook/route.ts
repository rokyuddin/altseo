import { Webhook } from '@creem_io/nextjs';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Helper to update user subscription in Supabase and revalidate caches
 */
const updateSubscription = async (userId: string, data: any) => {
    const supabase = createAdminClient();
    
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    if (error) {
        console.error('Error updating subscription in webhook:', error);
        throw error;
    }

    // Revalidate paths and tags to ensure UI is up to date
    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'layout');
    // Revalidate tags to ensure UI is up to date
    revalidateTag('user-plan', 'max');
};

export const POST = Webhook({
    webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
    
    // Primary handler for granting access (active, trialing, paid)
    onGrantAccess: async ({ customer, metadata, status }) => {
        const userId = metadata?.userId as string;
        if (!userId) {
            console.error('No userId found in webhook metadata');
            return;
        }

        console.log(`Granting access: status=${status}, userId=${userId}`);

        await updateSubscription(userId, {
            plan_type: 'pro',
            subscription_status: status,
            creem_customer_id: customer.id,
        });
    },

    // Primary handler for revoking access (paused, expired, canceled after period)
    onRevokeAccess: async ({ metadata, status, reason }) => {
        const userId = metadata?.userId as string;
        if (!userId) return;

        console.log(`Revoking access: status=${status}, reason=${reason}, userId=${userId}`);

        await updateSubscription(userId, {
            subscription_status: status,
            // For expired/canceled, we might want to reset plan_type to free
            ...(reason === 'subscription_expired' ? { plan_type: 'free' } : {})
        });
    },

    // Handle successful payments specifically
    onSubscriptionPaid: async ({ metadata, status }) => {
        const userId = metadata?.userId as string;
        if (!userId) return;

        await updateSubscription(userId, {
            subscription_status: status,
        });
    },

    // Handle cancellations (marks as canceled but access may still be active)
    onSubscriptionCanceled: async ({ metadata, status }) => {
        const userId = metadata?.userId as string;
        if (!userId) return;

        await updateSubscription(userId, {
            subscription_status: status,
        });
    },

    // Handle expiration (access is definitely gone)
    onSubscriptionExpired: async ({ metadata, status }) => {
        const userId = metadata?.userId as string;
        if (!userId) return;

        await updateSubscription(userId, {
            plan_type: 'free',
            subscription_status: status,
        });
    },

    // Handle pausing
    onSubscriptionPaused: async ({ metadata, status }) => {
        const userId = metadata?.userId as string;
        if (!userId) return;

        await updateSubscription(userId, {
            subscription_status: status,
        });
    },

    // Handle plan updates (e.g. upgrading/downgrading between paid plans)
    onSubscriptionUpdate: async ({ metadata, status, product }) => {
        const userId = metadata?.userId as string;
        if (!userId) return;

        console.log(`Subscription updated: status=${status}, product=${product.name}`);

        await updateSubscription(userId, {
            subscription_status: status,
            plan_type: 'pro', // Assuming all Creem products for now are Pro
        });
    },

    // Log checkout completions for debugging/tracking
    onCheckoutCompleted: async ({ customer, product, metadata }) => {
        console.log(`Checkout completed: ${customer?.email} purchased ${product.name}`);
    }
});
