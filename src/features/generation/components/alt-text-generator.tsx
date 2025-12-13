'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Loader2, Sparkles, Copy, Check, Edit2, Save } from 'lucide-react'
import { Input } from '@/components/atoms/input'
import { updateAltText } from '@/features/upload/actions/upload-actions'

interface AltTextGeneratorProps {
  imageId: string
  storagePath: string
  initialAltText?: string | null
  onGenerated?: (altText: string) => void
}

export function AltTextGenerator({
  imageId,
  storagePath,
  initialAltText,
  onGenerated,
}: AltTextGeneratorProps) {
  const [altText, setAltText] = useState(initialAltText || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAltText = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, storagePath }),
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

  if (!altText) {
    return (
      <div className="space-y-2">
        <Button
          onClick={generateAltText}
          disabled={isGenerating}
          size="sm"
          className="w-full"
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
          <p className="text-xs text-red-500">{error}</p>
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
              className="flex-1 text-sm"
              placeholder="Enter alt text..."
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              variant="default"
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
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </div>

      {!altText && (
        <Button
          onClick={generateAltText}
          disabled={isGenerating}
          size="sm"
          variant="outline"
          className="w-full"
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
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
