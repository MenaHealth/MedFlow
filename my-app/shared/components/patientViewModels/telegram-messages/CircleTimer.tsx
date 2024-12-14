import React from 'react';

interface CircleTimerProps {
    progress: number;
}

const CircleTimer: React.FC<CircleTimerProps> = ({ progress }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <circle
                cx="12"
                cy="12"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
            />
            <circle
                cx="12"
                cy="12"
                r={radius}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 12 12)"
            />
        </svg>
    );
};

export default CircleTimer;

