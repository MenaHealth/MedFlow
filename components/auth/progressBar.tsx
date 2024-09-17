import React from 'react';

const ProgressBar = ({ progress }) => {
    console.log('Rendering ProgressBar with progress:', progress); // Ensure progress updates correctly

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;