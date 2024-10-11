// components/ui/list/List.tsx
import React, { ReactNode } from 'react';

interface ListProps {
    children: ReactNode;
    className?: string;
}

export const List: React.FC<ListProps> = ({ children, className }) => {
    return (
        <ul className={`list-none p-0 ${className}`}>
            {children}
        </ul>
    );
};