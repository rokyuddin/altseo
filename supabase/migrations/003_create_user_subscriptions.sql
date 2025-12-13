-- Create user subscriptions table
create table if not exists public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan_type text not null default 'free' check (plan_type in ('free', 'pro')),
  subscription_status text not null default 'active' check (subscription_status in ('active', 'cancelled', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_subscriptions enable row level security;

-- RLS Policies
create policy "Users can view their own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update their own subscription"
  on public.user_subscriptions for update
  using (auth.uid() = user_id);

-- Create index
create index user_subscriptions_user_id_idx on public.user_subscriptions(user_id);
create index user_subscriptions_plan_type_idx on public.user_subscriptions(plan_type);

-- Function to automatically create free subscription for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_subscriptions (user_id, plan_type)
  values (new.id, 'free');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create subscription on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_user_subscriptions_updated_at
  before update on public.user_subscriptions
  for each row execute procedure public.update_updated_at_column();

