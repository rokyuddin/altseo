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
import { updateAltText } from '@/features/assets/actions/upload-actions'
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
            <SelectTrigger className="bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800 rounded-2xl w-full h-11 font-medium">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="border-zinc-200 dark:border-zinc-800 rounded-2xl">
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
          <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl font-semibold text-red-600 text-xs">
            <span className="mr-2 truncate">{error}</span>
            <Button onClick={handleRetry} size="sm" variant="ghost" className="hover:bg-red-100 px-2 h-7 shrink-0">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-[2.2rem] h-full">
      {/* Content Area */}
      <div className="group/text relative">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={editingText}
            onChange={(e) => updateState({ editingText: e.target.value })}
            className="bg-zinc-50 dark:bg-zinc-800 p-4 border-zinc-200 dark:border-zinc-700 rounded-2xl ring-primary/20 focus:ring-2 w-full min-h-[120px] font-medium text-sm leading-relaxed resize-none"
            placeholder="Edit text..."
          />
        ) : (
          <div className="z-0 relative flex flex-col px-1 min-h-[100px]">
            <p className="font-medium text-zinc-700 dark:text-zinc-300 text-sm italic leading-relaxed">
              "{currentAltText}"
            </p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className={cn("flex justify-between items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 shadow-sm p-1.5 border border-zinc-100 dark:border-zinc-800 rounded-full", {
        "mt-4": isEditing
      })}>
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              size="sm"
              onClick={() => updateState({ isEditing: false })}
              variant="ghost"
              className="flex-1 rounded-full h-9 font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-2 bg-zinc-900 hover:bg-zinc-800 rounded-full h-9 font-bold text-white text-xs"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="mr-1 w-3.5 h-3.5" />
              )}
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center px-1 w-full">
            <div className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-8 h-8 text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-[10px] text-muted-foreground/70 uppercase tracking-wider">Magic Alt SEO</span>
            </div>

            {/* Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-zinc-200 dark:hover:bg-zinc-800 p-0 rounded-full w-9 h-9 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/90 dark:bg-zinc-900/90 shadow-2xl backdrop-blur-xl p-1.5 border-white/40 rounded-2xl w-56">
                {onUpload && (
                  <>
                    <DropdownMenuItem onClick={onUpload} className="focus:bg-primary/10 rounded-xl h-11 font-bold text-primary cursor-pointer">
                      <Upload className="mr-3 w-4 h-4" />
                      Upload to Supabase
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={copyToClipboard} >
                  {copied ? (
                    <Check className="mr-3 w-4 h-4 text-green-500" />
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
          <p className="font-bold text-[10px] text-red-500 text-center italic">{error}</p>
        </div>
      )}
    </div>
  )
}
