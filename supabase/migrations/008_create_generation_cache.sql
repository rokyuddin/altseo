-- Create generation cache table to avoid duplicate AI API calls
create table if not exists public.generation_cache (
  id uuid default gen_random_uuid() primary key,
  storage_path text not null unique,
  alt_text text not null,
  variant text not null default 'default' check (variant in ('default', 'seo', 'long', 'accessibility')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Enable RLS (cache is readable by all authenticated users)
alter table public.generation_cache enable row level security;

-- RLS Policies - all authenticated users can read cache
create policy "Authenticated users can read cache"
  on public.generation_cache for select
  using (auth.role() = 'authenticated');

-- Service role can insert/update cache
create policy "Service role can manage cache"
  on public.generation_cache for all
  using (true);

-- Create indexes
create index generation_cache_storage_path_idx on public.generation_cache(storage_path);
create index generation_cache_expires_at_idx on public.generation_cache(expires_at);

-- Function to clean expired cache entries
create or replace function public.clean_expired_cache()
returns integer as $$
declare
  v_deleted_count integer;
begin
  delete from public.generation_cache
  where expires_at < timezone('utc'::text, now());
  
  get diagnostics v_deleted_count = row_count;
  return v_deleted_count;
end;
$$ language plpgsql security definer;

