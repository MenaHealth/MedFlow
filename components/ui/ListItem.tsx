// components/ui/list/ListItem.tsx
import React, { ReactNode } from 'react';

interface ListItemProps {
    children: ReactNode;
    className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ children, className }) => {
    return (
        <li className={`p-4 border-b border-gray-200 last:border-b-0 ${className}`}>
            {children}
        </li>
    );
};