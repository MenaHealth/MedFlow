import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  tooltipText: string;
  showTooltip: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ children, tooltipText, showTooltip }) => {
  return (
      <div className="relative group">
        {children}
        {showTooltip &&
            (
                <div
                    className="absolute top-full left-1/2 mt-2 hidden group-hover:block bg-gray-700 text-white text-sm rounded py-1 px-2 whitespace-nowrap z-50"
                    style={{
                      textTransform: 'none',
                      whiteSpace: 'pre-wrap',
                      maxWidth: '400px',
                    }}
                >
                  {tooltipText}
                </div>
            )
        }
      </div>
  );
};

export default Tooltip;

