// components/ui/box.tsx
import React from 'react';

interface BoxProps {
    children: React.ReactNode;
    className?: string;
}

const Box = ({ children, className }: BoxProps) => {
    return <div className={className}>{children}</div>;
};

export default Box;