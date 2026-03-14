"use client"

import type { ReactNode } from "react"
import type { VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type ButtonLinkProps = {
  href: string
  children: ReactNode
  className?: string
} & VariantProps<typeof buttonVariants>

export function ButtonLink({ href, children, className, variant, size }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size, className }))}>
      {children}
    </Link>
  )
}
