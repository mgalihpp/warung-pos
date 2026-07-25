import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { LoaderCircleIcon } from "lucide-react"

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">) {
  return (
  <LoaderCircleIcon
      strokeWidth={2}
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
