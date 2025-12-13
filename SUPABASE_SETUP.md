# Supabase Setup Instructions

## Prerequisites
- Supabase project created
- Environment variables configured in `.env.local`

## Database Setup

### 1. Run Migrations

You need to run the SQL migrations in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/001_create_images_table.sql`
3. Run `supabase/migrations/002_create_storage_bucket.sql`

**OR** if you have Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### 2. Verify Storage Bucket

After running the migrations, verify in your Supabase Dashboard:

1. Go to **Storage** → You should see an `images` bucket
2. The bucket should be **private** (not public)
3. RLS policies should be enabled

### 3. Test Upload

1. Start your dev server: `pnpm dev`
2. Navigate to `/dashboard`
3. Try uploading an image
4. Check Supabase Storage to verify the file was uploaded
5. Check the `images` table to verify metadata was saved

## Troubleshooting

### Upload fails with "Not authenticated"
- Make sure you're logged in
- Check that Supabase environment variables are correct

### Upload fails with "Storage bucket not found"
- Run migration `002_create_storage_bucket.sql`
- Or manually create the `images` bucket in Supabase Dashboard

### Upload succeeds but metadata not saved
- Run migration `001_create_images_table.sql`
- Check RLS policies are enabled

### Permission denied errors
- Verify RLS policies are correctly set up
- Check that the user is authenticated
