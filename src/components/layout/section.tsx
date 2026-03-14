import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type SectionProps = HTMLAttributes<HTMLElement>

export function Section({ className, ...props }: SectionProps) {
  return <section className={cn("py-4 sm:py-10", className)} {...props} />
}
