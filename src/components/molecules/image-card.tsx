'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/atoms/card'
import { AltSEOGenerator } from '@/features/upload/components/alt-text-generator'
import { X, Image as ImageIcon, FileImage, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/atoms/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/atoms/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/atoms/dialog"
import { Trash2, Loader2, List, LayoutGrid, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageCardProps {
  id: string
  storagePath: string
  fileName: string
  altText?: string | null
  previewUrl: string
  onRemove?: () => void
  onDelete?: () => void
  isDeleting?: boolean
  width?: number | null
  height?: number | null
  fileSize?: number | null
  mimeType?: string | null
  viewMode?: 'grid' | 'list'
  className?: string
  onGenerated?: (altText: string) => void
  onUpload?: () => void
}

export function ImageCard({
  id,
  storagePath,
  fileName,
  altText,
  previewUrl,
  onRemove,
  onDelete,
  isDeleting,
  width,
  height,
  fileSize,
  mimeType,
  viewMode = 'grid',
  className,
  onGenerated,
  onUpload,
}: ImageCardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setIsAuthenticated(!!user)
  }

  return (
    <Card className={cn(
      "container-card pt-0 gap-0 group overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/40 dark:border-zinc-800/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500",
      viewMode === 'list' ? "max-h-[300px]" : "",
      className
    )}>
      <div className={cn(
        "flex flex-col h-full",
        viewMode === 'list' ? "flex-row gap-2" : "@2xl:flex-row"
      )}>
        <div className={cn(
          "relative overflow-hidden rounded-4xl m-2 shadow-inner shrink-0",
          viewMode === 'list' ? "w-40 aspect-square" : "aspect-16/10 @2xl:aspect-square @2xl:w-1/3 @2xl:m-4 @2xl:mb-4"
        )}>
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

          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-white/20 backdrop-blur-md border-white/20 shadow-xl"
                >
                  <Maximize2 className="h-4 w-4 text-white" />
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="md:max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Image Preview: {fileName}</DialogTitle>
                  <DialogDescription>
                    Full screen view of the selected image.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl -z-10" onClick={() => setShowPreview(false)} />
                  <img
                    src={previewUrl}
                    alt={altText || fileName}
                    className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl animate-in zoom-in duration-300"
                  />
                  <Button
                    onClick={() => setShowPreview(false)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-8 right-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                  >
                    <X className="h-6 w-6" />
                  </Button>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                    <p className="text-white font-bold text-sm truncate max-w-[200px] md:max-w-md">{fileName}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isDeleting}
                    className="h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-white/20 hover:bg-red-500 backdrop-blur-md border-white/20 shadow-xl"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-white" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-4xl border-white/40 backdrop-blur-2xl bg-white/80">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Delete this masterpiece?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-lg">
                      This will permanently remove the image and its alt SEO metadata. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="rounded-full px-8 py-6 font-bold text-base border-zinc-200">Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="rounded-full px-8 py-6 bg-red-600 hover:bg-red-700 text-white font-bold text-base"
                    >
                      Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {onRemove && (
              <Button
                size="sm"
                variant="destructive"
                className="h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-white/20 hover:bg-red-500 backdrop-blur-md border-white/20 shadow-xl"
                onClick={onRemove}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>

          {/* File Info Float */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <div className="flex gap-2">
              {width && height && viewMode !== 'list' && (
                <span className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-medium border border-white/10">
                  {width}×{height}
                </span>
              )}
            </div>
          </div>
        </div>

        <CardContent className={cn(
          "flex-1 flex flex-col justify-center",
          viewMode === 'list' ? "p-2" : "p-4 @2xl:p-6 @2xl:pl-2"
        )}>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className={cn(
                "font-bold text-foreground truncate flex-1 tracking-tight",
                viewMode === 'list' ? "text-base" : "text-lg @2xl:text-xl"
              )}>
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
                    {fileSize && <p className="text-xs text-zinc-400">Size: <span className="text-white font-bold">{(fileSize / 1024 / 1024).toFixed(2)} MB</span></p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className={cn(
            "mt-4",
            viewMode === 'list' ? "mt-2" : ""
          )}>
            <AltSEOGenerator
              imageId={id}
              storagePath={storagePath}
              fileName={fileName}
              initialAltText={altText}
              allowDownload={true}
              isAuthenticated={isAuthenticated}
              onGenerated={onGenerated}
              onUpload={onUpload}
            />
          </div>
        </CardContent>
      </div>
    </Card>

  )
}
