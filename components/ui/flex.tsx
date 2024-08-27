// components/ui/flex.tsx
import React from 'react';

interface FlexProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'row' | 'column';
    justify?: 'start' | 'center' | 'end';
    align?: 'start' | 'center' | 'end';
}

const Flex = ({
                  children,
                  className,
                  direction = 'row',
                  justify = 'start',
                  align = 'start',
              }: FlexProps) => {
    return (
        <div
            className={`${className} flex ${direction === 'row' ? 'flex-row' : 'flex-col'} justify-${justify} items-${align}`}
        >
            {children}
        </div>
    );
};

export default Flex;