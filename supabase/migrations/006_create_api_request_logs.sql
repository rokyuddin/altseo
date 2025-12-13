-- Create API request logs table
create table if not exists public.api_request_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  api_key_id uuid references public.api_keys(id) on delete set null,
  endpoint text not null,
  method text not null,
  status_code integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.api_request_logs enable row level security;

-- RLS Policies
create policy "Users can view their own API request logs"
  on public.api_request_logs for select
  using (auth.uid() = user_id);

create policy "Service role can insert API request logs"
  on public.api_request_logs for insert
  with check (true);

-- Create indexes
create index api_request_logs_user_id_idx on public.api_request_logs(user_id);
create index api_request_logs_api_key_id_idx on public.api_request_logs(api_key_id);
create index api_request_logs_created_at_idx on public.api_request_logs(created_at desc);

