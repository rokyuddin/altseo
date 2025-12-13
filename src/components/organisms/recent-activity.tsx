import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { createClient } from '@/lib/supabase/client'
import { Clock, CheckCircle, XCircle, FileImage } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  images: Array<{
    id: string
    alt_text: string | null
    created_at: string
  }>
}

export function RecentActivity({ images }: RecentActivityProps) {
  const supabase = createClient()

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('images').getPublicUrl(storagePath)
    return data.publicUrl
  }

  // Get the most recent images with their metadata
  const recentImages = images.slice(0, 4)

  if (recentImages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest uploads and generations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileImage className="h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No recent activity yet
            </p>
            <Link href="/dashboard">
              <Button>Upload Your First Image</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest uploads and generations
          </CardDescription>
        </div>
        <Link href="/dashboard/history">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentImages.map((image) => (
            <div key={image.id} className="flex items-center justify-between p-3 rounded-lg border bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
                  <FileImage className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    Image uploaded
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {image.alt_text ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Alt text generated</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-amber-600" />
                        <span className="text-xs text-amber-600">Pending generation</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {recentImages.length >= 4 && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/dashboard/history">
              <Button variant="ghost" className="w-full">
                View all activity →
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
