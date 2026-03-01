import { type ReactNode, type HTMLAttributes } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({ className, style, children, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(0,0,0,0.7)",
          zIndex:     100,
        }}
      />
      <DialogPrimitive.Content
        className={cn("fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-xl outline-none", className)}
        style={{
          background:   "var(--color-bg-card)",
          border:       "1px solid var(--color-border-dim)",
          color:        "var(--color-text-primary)",
          zIndex:       101,
          maxWidth:     "90vw",
          maxHeight:    "85vh",
          overflowY:    "auto",
          width:        "480px",
          ...style,
        }}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          style={{
            position:     "absolute",
            top:          "12px",
            right:        "12px",
            background:   "transparent",
            border:       "none",
            color:        "var(--color-text-muted)",
            cursor:       "pointer",
            padding:      "4px",
            borderRadius: "4px",
          }}
          aria-label="Close dialog"
        >
          <X size={16} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
}

export function DialogTitle({ className, style, ...props }: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      style={{ fontFamily:"var(--font-display)", color:"var(--color-text-primary)", ...style }}
      {...props}
    />
  )
}

export function DialogDescription({ className, ...props }: DialogPrimitive.DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      style={{ color:"var(--color-text-muted)" }}
      {...props}
    />
  )
}
