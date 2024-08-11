import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  tooltipText: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, tooltipText }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute top-full left-1/2 mt-2 hidden group-hover:block bg-gray-700 text-white text-sm rounded py-1 px-2 whitespace-nowrap z-50">
        {tooltipText}
      </div>
    </div>
  );
};

export default Tooltip;