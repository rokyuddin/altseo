'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Loader2, Sparkles, Copy, Check, Edit2, Save, Download, RefreshCw } from 'lucide-react'
import { Input } from '@/components/atoms/input'
import { updateAltText } from '@/features/upload/actions/upload-actions'
import { downloadAsTxt, downloadAsJson } from '@/lib/download'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'

type Variant = 'default' | 'seo' | 'long' | 'accessibility'

interface AltSEOGeneratorProps {
  imageId: string
  storagePath: string
  fileName?: string
  initialAltText?: string | null
  onGenerated?: (altText: string) => void
  allowDownload?: boolean
  isAuthenticated?: boolean
}

export function AltSEOGenerator({
  imageId,
  storagePath,
  fileName = 'image',
  initialAltText,
  onGenerated,
  allowDownload = true,
  isAuthenticated = true,
}: AltSEOGeneratorProps) {
  const [altText, setAltText] = useState(initialAltText || '')
  const [variant, setVariant] = useState<Variant>('default')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  const generateAltText = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Check if this is a guest user (blob URL)
      let finalStoragePath = storagePath
      let isGuest = false
      
      if (storagePath.startsWith('blob:')) {
        // Convert blob URL to data URL for server-side processing
        isGuest = true
        try {
          const response = await fetch(storagePath)
          const blob = await response.blob()
          finalStoragePath = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          })
        } catch (err) {
          throw new Error('Failed to process image. Please try again.')
        }
      } else if (storagePath.startsWith('data:')) {
        isGuest = true
        finalStoragePath = storagePath
      }
      
      const response = await fetch('/api/generate-alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, storagePath: finalStoragePath, variant, isGuest }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate alt text')
      }

      setAltText(data.altText)
      onGenerated?.(data.altText)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate alt text')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await updateAltText(imageId, altText)
      if (result.error) {
        throw new Error(result.error)
      }
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save alt text')
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(altText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownloadTxt = () => {
    downloadAsTxt(altText, fileName)
    setShowDownloadMenu(false)
  }

  const handleDownloadJson = () => {
    downloadAsJson(altText, fileName, {
      imageId,
      storagePath,
    })
    setShowDownloadMenu(false)
  }

  const handleRetry = () => {
    setError(null)
    generateAltText()
  }

  if (!altText) {
    return (
      <div className="space-y-3">
        <Select value={variant} onValueChange={(value) => setVariant(value as Variant)}>
          <SelectTrigger className="w-full h-9 rounded-full">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="seo">SEO Optimized</SelectItem>
            <SelectItem value="long">Long Description</SelectItem>
            <SelectItem value="accessibility">Accessibility Focused</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={generateAltText}
          disabled={isGenerating}
          size="sm"
          className="w-full rounded-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Alt Text
            </>
          )}
        </Button>
        {error && (
          <div className="space-y-2">
            <p className="text-xs text-red-500">{error}</p>
            <Button
              onClick={handleRetry}
              size="sm"
              variant="outline"
              className="w-full rounded-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="flex-1 text-sm rounded-full"
              placeholder="Enter alt text..."
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              variant="default"
              className="rounded-full"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </>
        ) : (
          <>
            <p className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
              {altText}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="rounded-full"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="rounded-full"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {allowDownload && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem onClick={handleDownloadTxt} className="rounded-lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download as .txt
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadJson} className="rounded-lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download as .json
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.location.href = '/register'}
                    className="rounded-full"
                    title="Sign up to download"
                  >
                    <Download className="h-4 w-4 opacity-50" />
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Button
        onClick={generateAltText}
        disabled={isGenerating}
        size="sm"
        variant="outline"
        className="w-full rounded-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Regenerating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Regenerate
          </>
        )}
      </Button>

      {error && (
        <div className="space-y-2">
          <p className="text-xs text-red-500">{error}</p>
          <Button
            onClick={handleRetry}
            size="sm"
            variant="outline"
            className="w-full rounded-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
