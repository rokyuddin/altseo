# Fix: Storage Bucket Not Found

## The Problem
You're getting "Bucket not found" because the storage bucket hasn't been created in Supabase yet.

## Quick Fix

### Option 1: Create Bucket via Supabase Dashboard (Recommended)

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** (left sidebar)
3. Click **New bucket**
4. Set:
   - **Name**: `images`
   - **Public bucket**: ✅ **Check this** (so images are publicly accessible)
5. Click **Create bucket**

### Option 2: Run SQL Migration

If you prefer SQL, go to **SQL Editor** and run:

```sql
-- Create public storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- RLS Policies for Storage
create policy "Anyone can view images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
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

**Note**: This makes the bucket **public** so anyone can view images (but only authenticated users can upload/delete their own).

## Verify

After creating the bucket:

1. Go to **Storage** → **images** bucket
2. You should see your uploaded files
3. Click on a file → you should see a public URL
4. Refresh your app and images should now display

## Alternative: Keep Bucket Private (More Secure)

If you want to keep the bucket private, you'll need to use **signed URLs** instead of public URLs. This requires code changes in `image-uploader.tsx`.

Let me know if you want to go with the private bucket approach!
