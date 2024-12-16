import React, { useRef, useState, useEffect } from 'react';
import { TableCell, Tooltip } from '@mui/material';

interface TableCellWithTooltipProps {
    children: React.ReactNode;
    tooltipText: string;
    maxWidth: string;
}

const TableCellWithTooltip: React.FC<TableCellWithTooltipProps> = ({ children, tooltipText, maxWidth }) => {
    const cellRef = useRef<HTMLTableCellElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Track hover state

    useEffect(() => {
        const cell = cellRef.current;
        if (cell) {
            const childElement = cell.firstChild as HTMLElement;
            if (childElement) {
                const textElement = childElement.firstChild as HTMLElement;
                if (textElement) {
                    textElement.style.overflow = 'hidden';
                    textElement.style.whiteSpace = 'nowrap';
                    textElement.style.textOverflow = 'ellipsis';
                    textElement.style.display = 'block';

                    // Check if the text overflows and set showTooltip accordingly
                    setShowTooltip(textElement.scrollWidth > textElement.clientWidth);
                }
            }
        }
    }, [children]);

    // Handler for mouse hover events
    const handleMouseEnter = () => {
        if (showTooltip) {
            setIsHovered(true); // Show tooltip when hovered and the cell is overflowing
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false); // Hide tooltip when not hovered
    };

    return (
        <TableCell
            ref={cellRef}
            style={{
                maxWidth,
                overflow: 'hidden',
                position: 'relative',
            }}
            onMouseEnter={handleMouseEnter} // Start showing tooltip on hover
            onMouseLeave={handleMouseLeave} // Hide tooltip when not hovered
        >
            <Tooltip
                title={tooltipText}
                PopperProps={{
                    modifiers: [
                        {
                            name: 'preventOverflow',
                            options: {
                                boundary: 'viewport',
                            },
                        },
                    ],
                }}
                enterDelay={500}
                leaveDelay={200}
                disableInteractive
                open={isHovered && showTooltip}
            >
                <div
                    className="block overflow-hidden text-ellipsis text-sm"
                    style={{
                        maxWidth,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {children}
                </div>
            </Tooltip>
        </TableCell>
    );
};

export default TableCellWithTooltip;
