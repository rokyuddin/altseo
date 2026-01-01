'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import { Loader2, Sparkles, Copy, Check, Edit2, Save, Download, RefreshCw, X, ChevronDown, Wand2 } from 'lucide-react'
import { Textarea } from '@/components/atoms/textarea'
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
import { cn } from '@/lib/utils'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
    }
  }, [isEditing])

  const generateAltText = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      let finalStoragePath = storagePath
      let isGuest = false

      if (storagePath.startsWith('blob:')) {
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
  }

  const handleDownloadJson = () => {
    downloadAsJson(altText, fileName, {
      imageId,
      storagePath,
    })
  }

  const handleRetry = () => {
    setError(null)
    generateAltText()
  }

  if (!altText) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={variant} onValueChange={(value) => setVariant(value as Variant)}>
            <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm font-medium">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
              <SelectItem value="default" className="rounded-xl">Default</SelectItem>
              <SelectItem value="seo" className="rounded-xl">SEO Focus</SelectItem>
              <SelectItem value="long" className="rounded-xl">Descriptive</SelectItem>
              <SelectItem value="accessibility" className="rounded-xl">Concise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateAltText}
          disabled={isGenerating}
          className='w-full'
        >
          {isGenerating ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Sparkles className="size-5" />
          )}
          {isGenerating ? "Analyzing..." : "Magic Generate"}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={handleRetry} size="sm" variant="ghost" className="h-7 px-2 hover:bg-red-100">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2.2rem]">
      {/* Content Area */}
      <div className="relative group/text">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="min-h-[120px] w-full bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-4 text-sm font-medium leading-relaxed focus:ring-2 ring-primary/20 resize-none"
            placeholder="Edit text..."
          />
        ) : (
          <div className="relative min-h-[100px] flex flex-col z-0">
            <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 px-1 italic">
              "{altText}"
            </p>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="z-10 absolute -top-2 -right-2 h-8 w-8 rounded-full backdrop-blur-md group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="size-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className={cn("flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm", {
        "mt-4": isEditing
      })}>
        {isEditing ? (
          <>
            <Button
              size="sm"
              onClick={() => setIsEditing(false)}
              variant="ghost"
              className="flex-1 rounded-full text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-2 rounded-full text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1" />
              )}
              Save Changes
            </Button>
          </>
        ) : (
          <>
            {/* Main Actions */}
            <div className="flex flex-1 items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="flex-1 rounded-full text-[11px] font-bold"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>

              {allowDownload && isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full h-9 px-3"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl p-1 w-44 shadow-2xl border-zinc-100">
                    <DropdownMenuItem onClick={handleDownloadTxt} className="rounded-xl h-10 font-medium">
                      <Download className="mr-2.5 h-4 w-4 text-primary" />
                      Download TXT
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadJson} className="rounded-xl h-10 font-medium">
                      <Download className="mr-2.5 h-4 w-4 text-primary" />
                      Download JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Regenerate Action */}
            <Button
              onClick={generateAltText}
              disabled={isGenerating}
              size="sm"
              variant="default"
              className="flex-1 rounded-full text-[11px] font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-95"
            >
              {isGenerating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Regenerate
            </Button>
          </>
        )}
      </div>

      {error && (
        <div className="px-4 pb-4">
          <p className="text-[10px] text-red-500 font-bold text-center italic">{error}</p>
        </div>
      )}
    </div>
  )
}
