'use client'

import { useState } from 'react'
import { ImageCard } from '@/components/molecules/image-card'
import { Button } from '@/components/atoms/button'
import { LayoutGrid, List, Loader2 } from 'lucide-react'
import { deleteImage } from '../actions/upload-actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface HistoryResultsProps {
  initialResults: any[]
}

export function HistoryResults({ initialResults }: HistoryResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const getImageUrl = (storagePath: string) => {
    if (storagePath.startsWith('blob:') || storagePath.startsWith('data:')) return storagePath;
    const { data } = supabase.storage.from("images").getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const handleDelete = async (id: string, storagePath: string) => {
    setDeletingId(id)
    try {
      const result = await deleteImage(id, storagePath)
      if (result.success) {
        router.refresh()
      } else {
        console.error('Delete failed:', result.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/60 shadow-sm flex gap-1 items-center">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn(
               "rounded-full h-10 px-6 font-bold transition-all duration-300",
               viewMode === 'grid' ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <LayoutGrid className="size-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn(
               "rounded-full h-10 px-6 font-bold transition-all duration-300",
               viewMode === 'list' ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <List className="size-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      <div className={cn(
        "grid gap-8 transition-all duration-500",
        viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}>
        {initialResults.map((result) => (
          <ImageCard
            key={result.id}
            id={result.id}
            storagePath={result.storage_path}
            fileName={result.file_name}
            altText={result.alt_text}
            previewUrl={getImageUrl(result.storage_path)}
            width={result.width}
            height={result.height}
            fileSize={result.file_size}
            mimeType={result.mime_type}
            onDelete={() => handleDelete(result.id, result.storage_path)}
            isDeleting={deletingId === result.id}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  )
}
