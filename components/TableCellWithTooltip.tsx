import React, { useRef, useState, useEffect } from 'react';
import Tooltip from './form/Tooltip';
import { TableCell } from '@mui/material';

interface TableCellWithTooltipProps {
    children: React.ReactNode;
    tooltipText: string;
    maxWidth: string;
}

const TableCellWithTooltip: React.FC<TableCellWithTooltipProps> = ({ children, tooltipText, maxWidth }) => {
    const cellRef = useRef<HTMLTableCellElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const cell = cellRef.current;
        if (cell && cell.firstChild) {
            const childElement = cell.firstChild as HTMLElement;
            const secondChildElement = childElement.firstChild as HTMLElement;
            setShowTooltip(secondChildElement.scrollWidth > secondChildElement.offsetWidth);
        }
    }, [children]);

    return (
        <TableCell
            ref={cellRef}
            style={{
                maxWidth,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}
        >
            <Tooltip tooltipText={tooltipText} showTooltip={showTooltip}>
                {children}
            </Tooltip>
        </TableCell>
    );
};

export default TableCellWithTooltip;
