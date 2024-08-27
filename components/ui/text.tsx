// components/ui/text.tsx
import React from 'react';

interface TextProps {
    children: React.ReactNode;
    className?: string;
    weight?: 'bold' | 'normal';
}

const Text = ({ children, className, weight = 'normal' }: TextProps) => {
    return (
        <p
            className={`${className} ${weight === 'bold' ? 'font-bold' : 'font-normal'}`}
        >
            {children}
        </p>
    );
};

export default Text;