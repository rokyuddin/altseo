export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white dark:border-r border-zinc-800">
        <div className="z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          AltTextGen
        </div>
        <div className="z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This tool saves me hours of work every week. The SEO-optimized alt text is a game changer for my content workflow.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Form Side */}
      <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-black">
        <div className="mx-auto w-full max-w-[350px] space-y-6 flex flex-col items-center justify-center">
            {children}
        </div>
      </div>
    </div>
  )
}
