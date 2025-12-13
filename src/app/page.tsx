import Link from 'next/link'
import { Button } from '@/components/atoms/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-zinc-800 bg-zinc-950/50 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-zinc-800/80 lg:p-4 lg:dark:bg-zinc-800/30">
          AltTextGen - AI Powered Alt Text
        </p>
      </div>

      <div className="relative flex place-items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Automate your SEO <br/> with AI Vision
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left gap-4">
        <Link href="/login">
            <Button size="lg" className="w-full">
                Get Started
            </Button>
        </Link>
        <Link href="/register">
             <Button variant="outline" size="lg" className="w-full text-zinc-900 bg-white hover:bg-zinc-100">
                Create Account
             </Button>
        </Link>
      </div>
    </main>
  )
}
