import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-gray-200 bg-white bg-opacity-50 backdrop-filter backdrop-blur-md text-gray-950 shadow-sm p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card;