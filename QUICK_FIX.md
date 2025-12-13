# Quick Fix: Run Database Migrations

## The Error
```
Could not find the table 'public.images' in the schema cache
```

This means the database table hasn't been created yet.

## Solution: Run SQL Migrations in Supabase Dashboard

### Step 1: Create Images Table

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste this SQL:

```sql
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
```

5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned"

### Step 2: Create Storage Bucket

1. In the same SQL Editor, create a **New Query**
2. Copy and paste this SQL:

```sql
-- Storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', false);

-- RLS Policies for Storage
create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own images"
  on storage.objects for select
  using (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

3. Click **Run**

### Step 3: Verify

1. Go to **Table Editor** → You should see the `images` table
2. Go to **Storage** → You should see the `images` bucket

### Step 4: Test Upload

1. Refresh your app at `http://localhost:3000/dashboard`
2. Try uploading an image
3. The error should be gone!

---

## Alternative: If Storage Bucket Already Exists

If you get an error saying the bucket already exists, just run this instead:

```sql
-- Just add the RLS policies
create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own images"
  on storage.objects for select
  using (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```
