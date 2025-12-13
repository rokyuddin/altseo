# Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key
```

## Getting Your API Keys

### Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Groq API Key

1. Go to [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy the key → `GROQ_API_KEY`

**Note**: Groq offers free tier with generous limits for vision models.

## Verify Setup

After adding the environment variables:

1. Restart your dev server: `pnpm dev`
2. Navigate to `/dashboard`
3. Upload an image
4. Click "Generate Alt Text"
5. You should see AI-generated alt text appear

## Troubleshooting

### "Unauthorized" error
- Check that your Supabase keys are correct
- Verify you're logged in

### "Failed to generate alt text"
- Verify `GROQ_API_KEY` is set correctly
- Check Groq API quota/limits
- Ensure the image is publicly accessible

### Storage bucket errors
- Make sure you've run the SQL migrations
- Verify the `images` bucket exists in Supabase Storage
