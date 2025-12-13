import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ImageUploader } from '@/features/upload/components/image-uploader'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Upload images and generate SEO-friendly alt text
        </p>
      </div>

      <ImageUploader />
    </div>
  )
}
