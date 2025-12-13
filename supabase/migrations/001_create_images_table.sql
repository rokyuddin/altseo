-- Create images table
create table if not exists public.images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  storage_path text not null,
  file_name text not null,
  file_size bigint not null,
  mime_type text not null,
  alt_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.images enable row level security;

-- RLS Policies
create policy "Users can view their own images"
  on public.images for select
  using (auth.uid() = user_id);

create policy "Users can insert their own images"
  on public.images for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own images"
  on public.images for update
  using (auth.uid() = user_id);

create policy "Users can delete their own images"
  on public.images for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index images_user_id_idx on public.images(user_id);
create index images_created_at_idx on public.images(created_at desc);
