'use client'

import { Card, CardContent } from '@/components/atoms/card'
import { AltSEOGenerator } from '@/features/assets/components/alt-text-generator'
import { X, Image as ImageIcon, CheckCircle, Info, Maximize2, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/atoms/button'
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
import { cn } from '@/lib/utils'
import { useUploadStore } from '@/features/assets/store/upload-store'

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
  index?: number
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
  index,
}: ImageCardProps) {
  // Zustand State
  const isAuthenticated = useUploadStore((state) => state.isAuthenticated)
  const storeImage = useUploadStore((state) => {
    if (index !== undefined) return state.images[index];
    return state.standaloneStates[id];
  });
  const updateStore = useUploadStore((state) => index !== undefined ? state.updateImage : state.updateStandaloneState);

  const showPreview = !!storeImage?.showPreview;
  const setShowPreview = (show: boolean) => {
    if (index !== undefined) {
      (updateStore as any)(index, { showPreview: show });
    } else {
      (updateStore as any)(id, { showPreview: show });
    }
  };

  return (
    <Card className={cn(
      "group gap-0 bg-white/80 dark:bg-zinc-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl pt-0 border-white/40 dark:border-zinc-800/40 rounded-[2.5rem] overflow-hidden transition-all duration-500 container-card",
      viewMode === 'list' ? "max-h-[300px]" : "",
      className
    )}>
      <div className={cn(
        "flex flex-col h-full",
        viewMode === 'list' ? "flex-row gap-2" : "@2xl:flex-row"
      )}>
        <div className={cn(
          "relative shadow-inner m-2 rounded-4xl overflow-hidden shrink-0",
          viewMode === 'list' ? "w-40 aspect-square" : "aspect-16/10 @2xl:aspect-square @2xl:w-1/3 @2xl:m-4 @2xl:mb-4"
        )}>
          <img
            src={previewUrl}
            alt={altText || fileName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Status badges */}
          <div className="top-4 left-4 absolute flex gap-2">
            {altText && (
              <div className="flex items-center gap-1.5 bg-green-500/90 shadow-lg backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-[10px] text-white uppercase tracking-wider animate-in duration-300 zoom-in">
                <CheckCircle className="w-3 h-3" />
                Generated
              </div>
            )}
          </div>

          {/* Action buttons overlay */}
          <div className="top-4 right-4 absolute flex gap-2">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/20 opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md p-0 border-white/20 rounded-full w-9 h-9 hover:scale-110 transition-all duration-300"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="flex justify-center items-center bg-transparent shadow-none p-0 border-none w-[95vw] md:max-w-4xl h-[90vh] overflow-hidden"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Image Preview: {fileName}</DialogTitle>
                  <DialogDescription>
                    Full screen view of the selected image.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative flex justify-center items-center p-4 w-full h-full">
                  <div className="-z-10 absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setShowPreview(false)} />
                  <img
                    src={previewUrl}
                    alt={altText || fileName}
                    className="shadow-2xl rounded-3xl max-w-full max-h-full object-contain animate-in duration-300 zoom-in"
                  />
                  <Button
                    onClick={() => setShowPreview(false)}
                    variant="ghost"
                    size="icon"
                    className="top-8 right-8 absolute bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full w-12 h-12 text-white"
                  >
                    <X className="w-6 h-6" />
                  </Button>

                  <div className="bottom-8 left-1/2 absolute bg-black/40 backdrop-blur-xl px-6 py-3 border border-white/10 rounded-full -translate-x-1/2">
                    <p className="max-w-[200px] md:max-w-md font-bold text-white text-sm truncate">{fileName}</p>
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
                    className="bg-white/20 hover:bg-red-500 opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md p-0 border-white/20 rounded-full w-9 h-9 hover:scale-110 transition-all duration-300"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-white" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white/80 backdrop-blur-2xl border-white/40 rounded-4xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold text-2xl">Delete this masterpiece?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-lg">
                      This will permanently remove the image and its alt SEO metadata. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="px-8 py-6 border-zinc-200 rounded-full font-bold text-base">Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="bg-red-600 hover:bg-red-700 px-8 py-6 rounded-full font-bold text-white text-base"
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
                className="bg-white/20 hover:bg-red-500 opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md p-0 border-white/20 rounded-full w-9 h-9 hover:scale-110 transition-all duration-300"
                onClick={onRemove}
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>

          {/* File Info Float */}
          <div className="right-4 bottom-4 left-4 absolute flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 pointer-events-none">
            <div className="flex gap-2">
              {width && height && viewMode !== 'list' && (
                <span className="bg-black/40 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full font-medium text-[10px] text-white/90">
                  {width}×{height}
                </span>
              )}
            </div>
          </div>
        </div>

        <CardContent className={cn(
          "flex flex-col flex-1 justify-center",
          viewMode === 'list' ? "p-2" : "p-4 @2xl:p-6 @2xl:pl-2"
        )}>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-2">
              <h3 className={cn(
                "flex-1 font-bold text-foreground truncate tracking-tight",
                viewMode === 'list' ? "text-base" : "text-lg @2xl:text-xl"
              )}>
                {fileName}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 rounded-full w-8 h-8">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 p-3 border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-xs">File Type: <span className="font-bold text-white">{mimeType || 'Unknown'}</span></p>
                    {fileSize && <p className="text-zinc-400 text-xs">Size: <span className="font-bold text-white">{(fileSize / 1024 / 1024).toFixed(2)} MB</span></p>}
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
              index={index}
              imageId={id}
              storagePath={storagePath}
              fileName={fileName}
              initialAltText={altText}
              onGenerated={onGenerated}
              onUpload={onUpload}
            />
          </div>
        </CardContent>
      </div>
    </Card>

  )
}
