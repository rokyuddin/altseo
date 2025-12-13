'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImageCard } from '@/components/molecules/image-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { Loader2, Clock } from 'lucide-react'

interface HistoryImage {
  id: string
  storage_path: string
  file_name: string
  alt_text: string | null
  created_at: string
}

export function HistoryView({ limit }: { limit: number | null }) {
  const [images, setImages] = useState<HistoryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadHistory()
  }, [limit])

  const loadHistory = async () => {
    try {
      let query = supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('images').getPublicUrl(storagePath)
    return data.publicUrl
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </CardContent>
      </Card>
    )
  }

  if (images.length === 0) {
    return (
      <Card className="rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            No history yet
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
            Start generating alt text for your images to see them appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800">
              <img
                src={getImageUrl(image.storage_path)}
                alt={image.alt_text || image.file_name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate mb-1">
                  {image.file_name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(image.created_at)}
                </p>
              </div>
              <ImageCard
                id={image.id}
                storagePath={image.storage_path}
                fileName={image.file_name}
                altText={image.alt_text}
                previewUrl={getImageUrl(image.storage_path)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

