import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator

export function DropdownMenuContent({ className, style, sideOffset = 4, ...props }: DropdownMenuPrimitive.DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn("min-w-[8rem] overflow-hidden rounded-lg p-1 shadow-md outline-none", className)}
        style={{
          background:   "var(--color-bg-card)",
          border:       "1px solid var(--color-border-dim)",
          zIndex:       200,
          ...style,
        }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({ className, style, ...props }: DropdownMenuPrimitive.DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn("flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none", className)}
      style={{
        color:        "var(--color-text-primary)",
        fontSize:     "13px",
        gap:          "8px",
        ...style,
      }}
      onFocus={e => (e.currentTarget.style.background = "var(--color-cyan-dim)")}
      onBlur={e =>  (e.currentTarget.style.background = "transparent")}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--color-cyan-dim)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      {...props}
    />
  )
}
