import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SpinnerProps extends React.ComponentProps<"svg"> {
  containerClassName?: string
}

function Spinner({ className, containerClassName, ...props }: SpinnerProps) {
  return (
    <div className={cn("flex justify-center items-center", containerClassName)}>
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn("size-4 text-primary animate-spin", className)}
        {...props}
      />
    </div>
  )
}

export { Spinner }
