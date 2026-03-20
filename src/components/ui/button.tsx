import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border text-sm font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-primary/40 bg-primary text-black shadow-sm hover:bg-primary/90",
        destructive:
          "border-destructive/30 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-zinc-300 bg-background text-zinc-900 shadow-none hover:border-primary hover:bg-primary hover:text-black dark:border-zinc-700 dark:text-zinc-100",
        secondary:
          "border-zinc-200 bg-zinc-100 text-zinc-900 shadow-none hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
        ghost: "border-transparent hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-11 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
