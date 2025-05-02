import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Solid blue color for the default button
        default: "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:opacity-90",
        
        // Solid blue color for the destructive button (using dark blue)
        destructive: "bg-blue-700 text-white shadow-md hover:bg-blue-800 hover:opacity-90",
        
        // Outline button with a solid blue border and background on hover
        outline: "border-2 border-[#] bg-transparent text-blue-700 hover:bg-blue-100",
        
        // Secondary button with solid blue color
        secondary: "bg-blue-300 text-white shadow-md hover:bg-blue-400 hover:opacity-90",
        
        // Ghost button with a solid blue hover effect
        ghost: "hover:bg-blue-100 hover:text-blue-700",
        
        // Link button with solid blue text and underline
        link: "text-blue-700 underline-offset-4 hover:underline",
        
        // Premium variant unchanged
        premium: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
