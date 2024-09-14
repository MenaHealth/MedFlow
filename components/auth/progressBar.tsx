// components/auth/ProgressBar.tsx
import { useContext } from 'react';
import { SignupContext } from './SignupContext';

const ProgressBar = () => {
    const { progress } = useContext(SignupContext);

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
                className="bg-orange h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress * 100}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;