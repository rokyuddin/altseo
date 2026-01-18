import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
  hideText?: boolean
}

const sizeMap = {
  sm: {
    icon: 'w-5 h-5',
    iconContainer: 'w-6 h-6',
    text: 'text-base',
  },
  md: {
    icon: 'w-4 h-4',
    iconContainer: 'w-8 h-8',
    text: 'text-lg',
  },
  lg: {
    icon: 'w-5 h-5',
    iconContainer: 'w-10 h-10',
    text: 'text-xl',
  },
}

export function Logo({ 
  className, 
  iconClassName, 
  textClassName,
  size = 'md',
  href = '/',
  hideText = false
}: LogoProps) {
  const sizes = sizeMap[size]
  
  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'bg-primary rounded-full flex items-center justify-center text-white',
        sizes.iconContainer,
        iconClassName
      )}>
        <Leaf className={cn('fill-current', sizes.icon)} />
      </div>
      {!hideText && (
        <span className={cn('font-bold tracking-tight', sizes.text, textClassName)}>
          AltSEO
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}
