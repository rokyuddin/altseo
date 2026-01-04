'use client'

import { useCallback, useRef } from 'react'
import { Upload, AlertCircle, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/atoms/alert'
import { useUploadStore } from '@/features/upload/store/upload-store'

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
  maxSize?: number // in MB
  accept?: string[]
  multiple?: boolean
  className?: string
}

export function UploadZone({
  onFilesSelected,
  maxSize = 20,
  accept = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  multiple = true,
  className,
}: UploadZoneProps) {
  // Zustand State
  const isDragging = useUploadStore((state) => state.isDragging)
  const setIsDragging = useUploadStore((state) => state.setIsDragging)
  const error = useUploadStore((state) => state.uploadError)
  const setError = useUploadStore((state) => state.setUploadError)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return []

      const validFiles: File[] = []
      const maxSizeBytes = maxSize * 1024 * 1024

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (!accept.includes(file.type)) {
          setError(`Invalid file type: ${file.type}. Accepted: ${accept.join(', ')}`)
          continue
        }

        if (file.size > maxSizeBytes) {
          setError(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: ${maxSize}MB`)
          continue
        }

        validFiles.push(file)
      }

      if (validFiles.length > 0) {
        setError(null)
      }

      return validFiles
    },
    [accept, maxSize, setError]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [setIsDragging])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = validateFiles(e.dataTransfer.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [validateFiles, onFilesSelected, setIsDragging]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const files = validateFiles(e.target.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
      // Reset input value so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [validateFiles, onFilesSelected]
  )

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 cursor-pointer overflow-hidden group',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/10'
            : 'border-border bg-card/50 hover:border-primary/40 hover:bg-accent/30 hover:shadow-xl hover:shadow-primary/5'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleFileInput}
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="flex flex-col items-center justify-center gap-8 text-center py-4">
          <div className={cn(
            'p-7 rounded-3xl transition-all duration-500 shadow-inner',
            isDragging
              ? 'bg-primary/20 scale-110 rotate-3'
              : 'bg-muted group-hover:bg-primary/10 group-hover:scale-105'
          )}>
            {isDragging ? (
              <FileImage className="w-12 h-12 text-primary animate-in zoom-in spin-in-3 duration-500" />
            ) : (
              <Upload className="w-12 h-12 text-muted-foreground transition-transform duration-500 group-hover:-translate-y-1" />
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground/90 tracking-tight">
              {isDragging ? 'Drop to upload' : 'Click or drag image to upload'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[320px] mx-auto leading-relaxed font-medium">
              Supports <span className="text-primary/70">{accept.map(t => t.split('/')[1].toUpperCase()).join(', ')}</span> up to {maxSize}MB
            </p>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-16 -translate-x-16 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-500 rounded-3xl border-red-200 bg-red-50/50 backdrop-blur-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}