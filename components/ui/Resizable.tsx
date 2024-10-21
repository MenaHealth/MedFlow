"use client"

import * as React from "react"
import { cn } from "../../utils/classNames"

interface ResizableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onResize'> { // Omit onResize from HTMLAttributes
    minWidth?: number;
    maxWidth?: number;
    defaultWidth?: number;
    onResize?: (width: number) => void; // Custom onResize prop with the correct type
}

const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
    ({ className, children, minWidth = 200, maxWidth = 800, defaultWidth = 400, onResize, ...props }, ref) => {
        const [width, setWidth] = React.useState(defaultWidth)
        const isDragging = React.useRef(false)
        const startX = React.useRef(0)
        const startWidth = React.useRef(0)

        const handleMouseDown = (e: React.MouseEvent) => {
            isDragging.current = true
            startX.current = e.clientX
            startWidth.current = width
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return
            const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth.current + e.clientX - startX.current))
            setWidth(newWidth)
            onResize?.(newWidth)
        }

        const handleMouseUp = () => {
            isDragging.current = false
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        return (
            <div
                ref={ref}
                className={cn("relative", className)}
                style={{ width: `${width}px` }}
                {...props}
            >
                {children}
                <div
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-300 hover:bg-gray-400"
                    onMouseDown={handleMouseDown}
                />
            </div>
        )
    }
)

Resizable.displayName = "Resizable"

export { Resizable }