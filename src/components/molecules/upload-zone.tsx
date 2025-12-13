'use client'

import { useCallback, useState } from 'react'
import { Upload, X, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  multiple = false,
  className,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    [accept, maxSize]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = validateFiles(e.dataTransfer.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [validateFiles, onFilesSelected]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = validateFiles(e.target.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [validateFiles, onFilesSelected]
  )

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-12 transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-zinc-300 dark:border-zinc-700'
        )}
      >
        <input
          type="file"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className={cn(
            'p-4 rounded-full transition-colors',
            isDragging ? 'bg-primary/10' : 'bg-zinc-100 dark:bg-zinc-800'
          )}>
            {isDragging ? (
              <FileImage className="w-8 h-8 text-primary" />
            ) : (
              <Upload className="w-8 h-8 text-zinc-500" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
            </p>
            <p className="text-xs text-zinc-500">
              or click to browse • Max {maxSize}MB • {accept.map(t => t.split('/')[1].toUpperCase()).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
