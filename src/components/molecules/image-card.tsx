'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/atoms/card'
import { AltSEOGenerator } from '@/features/generation/components/alt-text-generator'
import { X, Image as ImageIcon, FileImage } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/atoms/badge'

interface ImageCardProps {
  id: string
  storagePath: string
  fileName: string
  altText?: string | null
  previewUrl: string
  onRemove?: () => void
  width?: number | null
  height?: number | null
  fileSize?: number | null
  mimeType?: string | null
}

export function ImageCard({
  id,
  storagePath,
  fileName,
  altText,
  previewUrl,
  onRemove,
  width,
  height,
  fileSize,
  mimeType,
}: ImageCardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setIsAuthenticated(!!user)
  }

  return (
    <Card className="group overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border-white/20 dark:border-zinc-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={previewUrl}
          alt={altText || fileName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status overlay */}
        {altText && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-500/90 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
              ✓ Generated
            </Badge>
          </div>
        )}

        {/* Remove button */}
        {onRemove && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* File type indicator */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full p-2">
            <FileImage className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">
            {fileName}
          </h3>

          {(width || height || fileSize) && (
            <div className="flex flex-wrap gap-2">
              {width && height && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800">
                  {width} × {height}
                </Badge>
              )}
              {fileSize && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800">
                  {(fileSize / 1024 / 1024).toFixed(1)} MB
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="pt-2">
          <AltSEOGenerator
            imageId={id}
            storagePath={storagePath}
            fileName={fileName}
            initialAltText={altText}
            allowDownload={true}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </CardContent>
    </Card>
  )
}
