-- Add creem_customer_id and creem_subscription_id to user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS creem_customer_id TEXT,
ADD COLUMN IF NOT EXISTS creem_subscription_id TEXT;
