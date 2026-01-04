'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import {
  Loader2,
  Sparkles,
  Copy,
  Check,
  Edit2,
  Save,
  Download,
  RefreshCw,
  Upload,
  MoreHorizontal,
} from 'lucide-react'
import { Textarea } from '@/components/atoms/textarea'
import { updateAltText } from '@/features/upload/actions/upload-actions'
import { downloadAsTxt } from '@/lib/download'
import { useUploadStore } from '../store/upload-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  index?: number
  imageId: string
  storagePath: string
  fileName?: string
  initialAltText?: string | null
  onGenerated?: (altText: string) => void
  onUpload?: () => void
}

export function AltSEOGenerator({
  index,
  imageId,
  storagePath,
  fileName = 'image',
  initialAltText,
  onGenerated,
  onUpload,
}: AltSEOGeneratorProps) {
  // Zustand Store Selectors
  const storeImage = useUploadStore((state) => {
    if (index !== undefined) return state.images[index];
    return state.standaloneStates[imageId];
  });

  const storeGenerateAltText = useUploadStore((state) => state.generateAltText);
  const storeUpdateImage = useUploadStore((state) => state.updateImage);
  const storeUpdateStandalone = useUploadStore((state) => state.updateStandaloneState);

  // Helper to update state correctly based on context (indexed vs standalone)
  const updateState = (updates: any) => {
    if (index !== undefined) {
      storeUpdateImage(index, updates);
    } else {
      storeUpdateStandalone(imageId, updates);
    }
  };

  // Derived Values from Store
  const currentAltText = storeImage?.altText ?? (initialAltText || '');
  const isGenerating = !!storeImage?.generating;
  const isSaving = !!storeImage?.saving;
  const error = storeImage?.error;
  const isEditing = !!storeImage?.isEditing;
  const editingText = storeImage?.editingText ?? currentAltText;
  const variant = (storeImage?.variant as Variant) || 'default';
  const copied = !!storeImage?.copied;

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
    }
  }, [isEditing])

  const generateAltText = async () => {
    if (index !== undefined) {
      const result = await storeGenerateAltText(index, variant);
      if (result) onGenerated?.(result);
      return;
    }

    // Manual generation for standalone/history images
    updateState({ generating: true, error: null });

    try {
      let finalStoragePath = storagePath
      let isGuest = false

      if (storagePath.startsWith('blob:')) {
        isGuest = true
        const response = await fetch(storagePath)
        const blob = await response.blob()
        finalStoragePath = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      } else if (storagePath.startsWith('data:')) {
        isGuest = true
      }

      const response = await fetch('/api/generate-alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, storagePath: finalStoragePath, variant, isGuest }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to generate alt text')

      updateState({ altText: data.altText, generating: false });
      onGenerated?.(data.altText)
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : 'Failed to generate alt text',
        generating: false
      });
    }
  }

  const handleSave = async () => {
    updateState({ saving: true, error: null });

    try {
      const result = await updateAltText(imageId, editingText)
      if (result.error) throw new Error(result.error)

      updateState({ altText: editingText, isEditing: false, saving: false });
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : 'Failed to save',
        saving: false
      });
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentAltText)
      updateState({ copied: true });
      setTimeout(() => updateState({ copied: false }), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownloadTxt = () => {
    downloadAsTxt(currentAltText, fileName)
  }

  const handleRetry = () => {
    updateState({ error: null });
    generateAltText()
  }

  if (!currentAltText) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Select
            value={variant}
            onValueChange={(v) => updateState({ variant: v as Variant })}
          >
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
            <span className="truncate mr-2">{error}</span>
            <Button onClick={handleRetry} size="sm" variant="ghost" className="h-7 px-2 hover:bg-red-100 shrink-0">
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
            value={editingText}
            onChange={(e) => updateState({ editingText: e.target.value })}
            className="min-h-[120px] w-full bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-4 text-sm font-medium leading-relaxed focus:ring-2 ring-primary/20 resize-none"
            placeholder="Edit text..."
          />
        ) : (
          <div className="relative min-h-[100px] flex flex-col z-0 px-1">
            <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 italic">
              "{currentAltText}"
            </p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className={cn("flex items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm", {
        "mt-4": isEditing
      })}>
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              size="sm"
              onClick={() => updateState({ isEditing: false })}
              variant="ghost"
              className="flex-1 rounded-full text-xs font-bold h-9"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-2 rounded-full text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 h-9"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1" />
              )}
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Magic Alt SEO</span>
            </div>

            {/* Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full h-9 w-9 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-1.5 w-56 shadow-2xl border-white/40 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90">
                {onUpload && (
                  <>
                    <DropdownMenuItem onClick={onUpload} className="rounded-xl h-11 font-bold text-primary focus:bg-primary/10 cursor-pointer">
                      <Upload className="mr-3 h-4 w-4" />
                      Upload to Supabase
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={copyToClipboard} >
                  {copied ? (
                    <Check className="mr-3 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 size-4" />
                  )}
                  {copied ? "Copied!" : "Copy Alt Text"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => {
                  updateState({ editingText: currentAltText, isEditing: true });
                }} >
                  <Edit2 className="mr-2 size-4" />
                  Edit Text
                </DropdownMenuItem>

                <DropdownMenuItem aria-disabled={isGenerating} onClick={generateAltText} disabled={isGenerating} >
                  {isGenerating ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 size-4" />
                  )}
                  Regenerate
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleDownloadTxt}>
                  <Download className="mr-2 size-4" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
