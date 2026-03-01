import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, style, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
      style={{ width:40, height:40, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarFallback({ className, style, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center rounded-full", className)}
      style={{
        background: "linear-gradient(135deg, var(--color-cyan), var(--color-violet))",
        color:      "#fff",
        fontSize:   "14px",
        fontWeight: 700,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarImage({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  if (!src) return null
  return <img src={src} alt={alt ?? ""} className={cn("aspect-square h-full w-full object-cover", className)} />
}
