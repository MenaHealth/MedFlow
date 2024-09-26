// components/ui/card.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => {
      return (
          <div
              ref={ref} // Forwarding the ref here
              className={cn(
                  "relative rounded-lg border border-gray-200 bg-white backdrop-filter backdrop-blur-md text-gray-950 shadow-sm p-6",
                  className
              )}
              {...props}
          >
            {children}
          </div>
      );
    }
);

Card.displayName = "Card";