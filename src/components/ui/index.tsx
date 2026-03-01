import { type HTMLAttributes, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

// ── Progress ──────────────────────────────
interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
}
export function Progress({ value = 0, className, style, ...props }: ProgressProps) {
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      style={{ background:"var(--color-border-dim)", height:"6px", borderRadius:"3px", ...style }}
      {...props}
    >
      <div
        style={{
          height:       "100%",
          width:        `${Math.min(100, Math.max(0, value))}%`,
          background:   "linear-gradient(90deg, var(--color-cyan), var(--color-violet))",
          borderRadius: "3px",
          transition:   "width 0.3s ease",
        }}
      />
    </div>
  )
}

// ── Separator ─────────────────────────────
export function Separator({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shrink-0 bg-border", className)}
      style={{ height:"1px", background:"var(--color-border-dim)", margin:"8px 0", ...style }}
      {...props}
    />
  )
}

// ── Button ────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
}
export function Button({ className, style, variant = "default", size = "md", children, ...props }: ButtonProps) {
  const bg =
    variant === "outline"     ? "transparent" :
    variant === "ghost"       ? "transparent" :
    variant === "destructive" ? "rgba(239,68,68,0.15)" :
    "linear-gradient(135deg, var(--color-cyan), var(--color-violet))"

  const border =
    variant === "outline"     ? "1px solid var(--color-border-dim)" :
    variant === "destructive" ? "1px solid #ef4444" :
    "none"

  const color =
    variant === "outline"     ? "var(--color-text-muted)" :
    variant === "ghost"       ? "var(--color-text-muted)" :
    variant === "destructive" ? "#ef4444" :
    "#fff"

  const pad = size === "sm" ? "6px 12px" : size === "lg" ? "14px 24px" : "9px 18px"

  return (
    <button
      className={cn("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-opacity cursor-pointer", className)}
      style={{ background:bg, border, color, padding:pad, fontSize:"13px", ...style }}
      {...props}
    >
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────
export function Input({ className, style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm outline-none", className)}
      style={{
        background:   "var(--color-bg-deep)",
        border:       "1px solid var(--color-border-dim)",
        color:        "var(--color-text-primary)",
        fontSize:     "14px",
        borderRadius: "8px",
        padding:      "8px 12px",
        width:        "100%",
        ...style,
      }}
      {...props}
    />
  )
}

// ── Tooltip (simple title-based) ──────────
interface TooltipProps {
  children: React.ReactNode
  content:  string
}
export function Tooltip({ children, content }: TooltipProps) {
  return <span title={content}>{children}</span>
}
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const TooltipTrigger  = ({ children }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>
export const TooltipContent  = ({ children }: { children: React.ReactNode }) => null

// ── Card ──────────────────────────────────
export function Card({ className, style, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border", className)}
      style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-dim)", borderRadius:"12px", ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} style={{ padding:"16px 20px", ...style }} {...props} />
}

export function CardTitle({ className, style, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold leading-none tracking-tight", className)} style={{ fontFamily:"var(--font-display)", color:"var(--color-text-primary)", ...style }} {...props} />
}

export function CardContent({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} style={{ padding:"0 20px 20px", ...style }} {...props} />
}
