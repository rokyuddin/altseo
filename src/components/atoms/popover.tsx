"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Popover({ children, open, onOpenChange }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onOpenChange])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div ref={containerRef} className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              ...child.props,
              isOpen,
              onOpenChange: handleOpenChange,
            })
          : child
      )}
    </div>
  )
}

interface PopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function PopoverTrigger({ children, asChild, isOpen, onOpenChange }: PopoverTriggerProps) {
  const handleClick = () => {
    onOpenChange?.(!isOpen)
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    })
  }

  return (
    <button onClick={handleClick} className="cursor-pointer">
      {children}
    </button>
  )
}

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
  isOpen?: boolean
}

function PopoverContent({
  children,
  className,
  align = "center",
  sideOffset = 4,
  isOpen
}: PopoverContentProps) {
  if (!isOpen) return null

  const alignClass = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  }[align]

  return (
    <div
      className={cn(
        "absolute top-full mt-2 z-50 bg-popover text-popover-foreground rounded-md border shadow-md outline-none animate-in fade-in-0 zoom-in-95",
        alignClass,
        className
      )}
      style={{ marginTop: `${sideOffset}px` }}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
