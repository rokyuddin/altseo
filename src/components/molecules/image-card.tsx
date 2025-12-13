'use client'

import { Card, CardContent } from '@/components/atoms/card'
import { AltTextGenerator } from '@/features/generation/components/alt-text-generator'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/button'

interface ImageCardProps {
  id: string
  storagePath: string
  fileName: string
  altText?: string | null
  previewUrl: string
  onRemove?: () => void
}

export function ImageCard({
  id,
  storagePath,
  fileName,
  altText,
  previewUrl,
  onRemove,
}: ImageCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9]">
        <img
          src={previewUrl}
          alt={altText || fileName}
          className="w-full h-full object-cover"
        />
        {onRemove && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {fileName}
          </p>
        </div>
        <AltTextGenerator
          imageId={id}
          storagePath={storagePath}
          initialAltText={altText}
        />
      </CardContent>
    </Card>
  )
}
