'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/atoms/card'
import { AltSEOGenerator } from '@/features/upload/components/alt-text-generator'
import { X, Image as ImageIcon, FileImage, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/atoms/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/tooltip'

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
    <Card className="container-card pt-0 gap-0 group overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/40 dark:border-zinc-800/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
      <div className="flex flex-col @2xl:flex-row h-full">
        <div className="relative aspect-16/10 @2xl:aspect-square @2xl:w-1/3 overflow-hidden rounded-4xl m-2 @2xl:m-4 @2xl:mb-4 shadow-inner">
          <img
            src={previewUrl}
            alt={altText || fileName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Status badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {altText && (
              <div className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg animate-in zoom-in duration-300">
                <CheckCircle className="h-3 w-3" />
                Generated
              </div>
            )}
          </div>

          {/* Remove button */}
          {onRemove && (
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-4 right-4 h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-white/20 hover:bg-red-500 backdrop-blur-md border-white/20 shadow-xl"
              onClick={onRemove}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}

          {/* File Info Float */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <div className="flex gap-2">
              {width && height && (
                <span className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-medium border border-white/10">
                  {width}×{height}
                </span>
              )}
              {fileSize && (
                <span className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-medium border border-white/10">
                  {(fileSize / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-xl">
              <ImageIcon className="size-4 text-primary" />
            </div>
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col justify-center p-4 @2xl:p-6 @2xl:pl-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg @2xl:text-xl text-foreground truncate flex-1 tracking-tight">
                {fileName}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-xl p-3 bg-zinc-900 border-zinc-800">
                    <p className="text-xs text-zinc-400">File Type: <span className="text-white font-bold">{mimeType || 'Unknown'}</span></p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="mt-4">
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
      </div>
    </Card>
  )
}
