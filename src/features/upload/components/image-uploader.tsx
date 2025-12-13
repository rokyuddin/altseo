'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadZone } from '@/components/molecules/upload-zone'
import { ImageCard } from '@/components/molecules/image-card'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { CloudCog, Loader2 } from 'lucide-react'
import { saveImageMetadata } from '../actions/upload-actions'

interface UploadedImage {
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  error?: string
  storagePath?: string
  imageId?: string
}

interface SavedImage {
  id: string
  storage_path: string
  file_name: string
  alt_text: string | null
}

export function ImageUploader() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [savedImages, setSavedImages] = useState<SavedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Load saved images on mount
  useEffect(() => {
    loadSavedImages()
  }, [])

  const loadSavedImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSavedImages(data || [])
    } catch (error) {
      console.error('Failed to load images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilesSelected = (files: File[]) => {
    const newImages: UploadedImage[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }))

    setImages(prev => [...prev, ...newImages])
  }

  const uploadToSupabase = async (image: UploadedImage, index: number) => {
    // Update state to show uploading
    setImages(prev =>
      prev.map((img, i) => (i === index ? { ...img, uploading: true } : img))
    )

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Generate unique file name
      const fileExt = image.file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, image.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Save metadata to database
      const metadataResult = await saveImageMetadata({
        storagePath: data.path,
        fileName: image.file.name,
        fileSize: image.file.size,
        mimeType: image.file.type,
      })

      if (metadataResult.error) {
        console.error('Metadata save error:', metadataResult.error)
      }

      // Update state to show success
      setImages(prev =>
        prev.map((img, i) =>
          i === index
            ? { 
                ...img, 
                uploading: false, 
                uploaded: true, 
                storagePath: data.path,
                imageId: metadataResult.data?.id 
              }
            : img
        )
      )

      // Reload saved images
      await loadSavedImages()

      return data.path
    } catch (error) {
      console.error('Upload error:', error)
      setImages(prev =>
        prev.map((img, i) =>
          i === index
            ? { ...img, uploading: false, error: error instanceof Error ? error.message : 'Upload failed' }
            : img
        )
      )
      return null
    }
  }

  const handleUploadAll = async () => {
    setIsUploading(true)

    const uploadPromises = images
      .filter(img => !img.uploaded && !img.uploading)
      .map((img, idx) => {
        const actualIndex = images.indexOf(img)
        return uploadToSupabase(img, actualIndex)
      })

    await Promise.all(uploadPromises)
    setIsUploading(false)
    
    // Clear uploaded images from the pending list
    setImages(prev => prev.filter(img => !img.uploaded))
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('images').getPublicUrl(storagePath)
    return data.publicUrl
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Upload images to generate SEO-friendly alt text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UploadZone onFilesSelected={handleFilesSelected} multiple />

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {images.length} image{images.length > 1 ? 's' : ''} ready to upload
                </p>
                <Button
                  onClick={handleUploadAll}
                  disabled={isUploading || images.every(img => img.uploaded)}
                >
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upload All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <ImageCard
                      id={image.imageId || ''}
                      storagePath={image.storagePath || ''}
                      fileName={image.file.name}
                      previewUrl={image.preview}
                      onRemove={() => removeImage(index)}
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {savedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Images</CardTitle>
            <CardDescription>
              Previously uploaded images with generated alt text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedImages.map((image) => (
                <ImageCard
                  key={image.id}
                  id={image.id}
                  storagePath={image.storage_path}
                  fileName={image.file_name}
                  altText={image.alt_text}
                  previewUrl={getImageUrl(image.storage_path)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
