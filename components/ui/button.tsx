// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { SendHorizonal } from 'lucide-react'

import { cn } from "../../utils/classNames";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed", // Add disabled:cursor-not-allowed
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                orange: "bg-orange-500 border-orange-500 border-1 text-white hover:bg-darkBlue hover:text-white",
                orangeOutline: "text-orange-500 hover:border-orange-500 hover:border-2",
                submit: "border border-darkBlue text-darkBlue bg-white shadow-sm hover:bg-darkBlue hover:text-white hover:border-white hover:border-2"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {variant === 'submit' && <SendHorizonal className="mr-2 h-4 w-4" />}
                {children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }