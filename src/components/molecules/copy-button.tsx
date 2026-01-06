'use client'

import { Button } from "@/components/atoms/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
    text: string
    className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className={cn("gap-2 h-8 font-medium transition-all duration-300",
                copied && "border-green-500/50 bg-green-50/50 text-green-600 hover:bg-green-100/50 dark:bg-green-900/20",
                className
            )}
            onClick={handleCopy}
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Text
                </>
            )}
        </Button>
    )
}
