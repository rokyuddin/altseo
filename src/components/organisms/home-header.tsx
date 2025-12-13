'use client'

import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { Leaf } from 'lucide-react'
import { UserMenu } from '@/components/molecules/user-menu'
import type { User } from '@supabase/supabase-js'

interface HomeHeaderProps {
  user: User | null
}

export function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-full px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <Leaf className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold tracking-tight text-lg">AltSEO</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Grow</Link>
          <Link href="#methodology" className="hover:text-primary transition-colors">Process</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>
        <div className="flex gap-4 items-center">
          {user ? (
            <UserMenu userEmail={user.email} />
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-primary hidden sm:block">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-semibold shadow-lg shadow-primary/20">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

