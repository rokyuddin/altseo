import type { Metadata } from 'next'
import Link from "next/link";

export const metadata: Metadata = {
  title: '404 - Page Not Found | AltSEO',
}

export default function NotFound() {
  return (
    <div className="flex justify-center items-center bg-zinc-50 dark:bg-black px-4 min-h-screen">
      <div className="space-y-4 w-full max-w-md text-center">
        <h1 className="font-bold text-black dark:text-zinc-50 text-3xl">404</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-black hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 px-4 py-2 rounded-md font-medium text-white dark:text-black text-sm transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
