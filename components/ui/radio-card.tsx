// components/ui/radio-card.tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const RadioCardRoot = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    )
})
RadioCardRoot.displayName = RadioGroupPrimitive.Root.displayName

const RadioCardItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "relative border border-gray-200 rounded-lg p-2 hover:bg-gray-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5722]",
                className
            )}
            {...props}
        >
            {children}
            <RadioGroupPrimitive.Indicator className="absolute top-0 left-0 w-full h-full border-2 border-[#FF5722] rounded-lg" />
        </RadioGroupPrimitive.Item>
    )
})
RadioCardItem.displayName = RadioGroupPrimitive.Item.displayName

export const RadioCard = {
    Root: RadioCardRoot,
    Item: RadioCardItem,
}