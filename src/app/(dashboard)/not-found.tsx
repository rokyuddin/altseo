import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">404</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
