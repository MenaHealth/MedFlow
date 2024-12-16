// components/ui/card.tsx
import React from 'react'
import { cn } from "../../utils/classNames"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    backgroundColor?: string
    borderColor?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, backgroundColor, borderColor, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative rounded-lg border shadow-sm",
                    backgroundColor || "bg-white",
                    borderColor || "border-gray-200",
                    "backdrop-filter backdrop-blur-md text-gray-950",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardContent, CardFooter }