-- Create rate limiting tracking table
create table if not exists public.rate_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  image_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS
alter table public.rate_limits enable row level security;

-- RLS Policies
create policy "Users can view their own rate limits"
  on public.rate_limits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own rate limits"
  on public.rate_limits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own rate limits"
  on public.rate_limits for update
  using (auth.uid() = user_id);

-- Create indexes
create index rate_limits_user_id_date_idx on public.rate_limits(user_id, date desc);
create index rate_limits_date_idx on public.rate_limits(date);

-- Function to get or create rate limit record for today
create or replace function public.get_or_create_rate_limit(p_user_id uuid)
returns public.rate_limits as $$
declare
  v_rate_limit public.rate_limits;
begin
  -- Try to get existing record for today
  select * into v_rate_limit
  from public.rate_limits
  where user_id = p_user_id and date = current_date;

  -- If not found, create one
  if not found then
    insert into public.rate_limits (user_id, date, image_count)
    values (p_user_id, current_date, 0)
    returning * into v_rate_limit;
  end if;

  return v_rate_limit;
end;
$$ language plpgsql security definer;

-- Function to increment rate limit
create or replace function public.increment_rate_limit(p_user_id uuid)
returns integer as $$
declare
  v_count integer;
begin
  -- Get or create rate limit for today
  perform public.get_or_create_rate_limit(p_user_id);

  -- Increment count
  update public.rate_limits
  set image_count = image_count + 1,
      updated_at = timezone('utc'::text, now())
  where user_id = p_user_id and date = current_date
  returning image_count into v_count;

  return v_count;
end;
$$ language plpgsql security definer;

-- Update updated_at timestamp
create trigger update_rate_limits_updated_at
  before update on public.rate_limits
  for each row execute procedure public.update_updated_at_column();

