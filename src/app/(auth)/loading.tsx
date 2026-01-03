import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-svh w-full items-center justify-center p-8">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}
