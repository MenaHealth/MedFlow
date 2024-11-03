"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { X } from "lucide-react"

import { cn } from "../../utils/classNames";
import { ScrollArea } from "./ScrollArea";

type DrawerDirection = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps extends Omit<React.ComponentProps<typeof DrawerPrimitive.Root>, 'ref'> {
    direction?: DrawerDirection;
    shouldScaleBackground?: boolean;
}

const Drawer = React.forwardRef<
    HTMLDivElement,
    DrawerProps & { ref?: React.ForwardedRef<HTMLDivElement> }
>(({ shouldScaleBackground = true, direction = 'bottom', ...props }, ref) => {
    const compatibleProps = { ...props } as Omit<
        DrawerProps,
        'fadeFromIndex' | 'ref' | 'shouldScaleBackground'
    >;

    return (
        <div ref={ref}>
            <DrawerPrimitive.Root
                {...compatibleProps}
                shouldScaleBackground={shouldScaleBackground}
            />
        </div>
    );
});
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/80", className || '')}
        {...props}
    />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerClose = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Close
        ref={ref}
        className={cn(
            "absolute right-4 top-4 rounded-full p-2 text-foreground/50 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:pointer-events-none",
            className
        )}
        {...props}
    >
        <div className="bg-gray-200 rounded-full p-2 transition-colors hover:bg-gray-300 z-50">
            <X className="h-6 w-6" />
        </div>
        <span className="sr-only">Close</span>
    </DrawerPrimitive.Close>
))
DrawerClose.displayName = DrawerPrimitive.Close.displayName

interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
    direction?: DrawerDirection;
    size?: string;
    title?: string;
}

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    DrawerContentProps
>(({ className, children, direction = 'bottom', size = '100%', title, ...props }, ref) => {
    const sizeValue = size.endsWith('%') ? size : `${size}px`;
    const directionStyles = {
        left: `left-0 h-full max-w-[${sizeValue}] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left`,
        right: `right-0 h-full max-w-[${sizeValue}] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right`,
        top: `top-0 w-full max-h-[${sizeValue}] border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top`,
        bottom: `bottom-0 w-full max-h-[${sizeValue}] border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom`
    };

    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 scale-100 bg-background opacity-100 shadow-lg flex flex-col",
                    directionStyles[direction],
                    className
                )}
                style={{
                    height: ['top', 'bottom'].includes(direction) ? sizeValue : '100%',
                    width: ['left', 'right'].includes(direction) ? sizeValue : '100%',
                }}
                {...props}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    <DrawerHeader className="flex-shrink-0">
                        {title && <DrawerTitle className="text-2xl font-bold text-center">{title}</DrawerTitle>}
                        <DrawerClose className="z-50 absolute right-4 top-4 rounded-full p-4 text-orange-950 transition-colors hover:bg-orange-100">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </DrawerClose>
                    </DrawerHeader>

                    <ScrollArea className="flex-grow overflow-auto">
                        <div className="p-6">
                            {children}
                        </div>
                    </ScrollArea>

                    <DrawerFooter className="flex-shrink-0 md:hidden">
                        {/* Footer content here */}
                    </DrawerFooter>
                </div>
            </DrawerPrimitive.Content>
        </DrawerPortal>
    )
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className || '')}
        {...props}
    />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4", className)}
        {...props}
    />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className || '')}
        {...props}
    />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className || '')}
        {...props}
    />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
}