// components/ui/accordion.tsx
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from 'lucide-react'
import React from "react";

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm",
            className
        )}
        {...props}
    >
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="pb-4 pt-0">{children}</div>
            </motion.div>
        </AnimatePresence>
    </AccordionPrimitive.Content>
))

AccordionContent.displayName = "AccordionContent"

const Accordion = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Root
        ref={ref}
        className={cn("pb-6", className)}
        {...props}
    />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b border-gray-200", className)}
        {...props}
    />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-center py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }

