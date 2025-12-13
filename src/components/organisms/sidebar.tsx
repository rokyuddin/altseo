import Link from 'next/link'
import { Button } from '@/components/atoms/button'

export function Sidebar() {
  return (
    <div className="pb-12 min-h-screen w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hidden lg:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            AltTextGen
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard">
                <Button variant="secondary" className="w-full justify-start">
                  Dashboard
                </Button>
            </Link>
            <Link href="/dashboard/history">
                <Button variant="ghost" className="w-full justify-start">
                  History
                </Button>
            </Link>
            <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full justify-start">
                  Settings
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
