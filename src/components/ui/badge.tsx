// Minimal Badge component
import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function Badge({ className, children, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}
      style={{
        background:   "var(--color-cyan-dim)",
        border:       "1px solid var(--color-border-dim)",
        color:        "var(--color-text-primary)",
        fontFamily:   "var(--font-display)",
        letterSpacing:"0.04em",
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
