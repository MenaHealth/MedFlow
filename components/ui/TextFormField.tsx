import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { EyeOff, Eye } from "lucide-react";

interface Props {
    fieldName: string;
    fieldLabel: string;
    className?: string;
    type?: string;
    tooltip?: string;
    showTooltip?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    error?: string;
    disabled?: boolean;
    autoComplete?: string;
    id?: string;
    value?: string;
}

const TextFormField = ({
                           fieldName,
                           fieldLabel,
                           className,
                           type,
                           tooltip,
                           showTooltip,
                           onFocus,
                           onBlur,
                           autoComplete,
                           value,
                       }: Props) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const id = `${fieldName}-input`;

    const handleFocus = () => {
        setIsFocused(true);
        if (onFocus) onFocus();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (onBlur) onBlur();
    };

    return (
        <Controller
            name={fieldName}
            render={({ field }) => {
                if (value) {
                    field.value = value
                    value = undefined;
                }
                return(
                    <div className={`mt-6 mb-6 p-2 ${className}`}>
                        <div className="relative">
                            <Input
                                {...field}
                                type={type === 'password' && !isPasswordVisible ? 'password' : 'text'}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                id={id}
                                name={fieldName}
                                autoComplete={autoComplete}
                                className={`w-full pt-4 pb-2 pl-2 pr-10 ${
                                    isFocused || field.value ? 'bg-white' : ''
                                }`}
                            />
                            <label
                                htmlFor={id}
                                className={`absolute transition-all ${
                                    (isFocused || field.value) ? 'text-xs -top-6' : 'text-sm top-1/2 -translate-y-1/2'
                                } left-2 pointer-events-none`}
                            >
                                {fieldLabel}
                            </label>

                            {type === 'password' && (
                                <div
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onMouseEnter={() => setIsPasswordVisible(true)}  // Show password on hover
                                    onMouseLeave={() => setIsPasswordVisible(false)}  // Hide password when not hovering
                                >
                                    {isPasswordVisible ? (
                                        <Eye className="w-6 h-6" />
                                    ) : (
                                        <EyeOff className="w-6 h-6" />
                                    )}
                                </div>
                            )}

                            {showTooltip && tooltip && (
                                <div className="absolute left-0 bottom-full mt-2 w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                                    {tooltip}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }}
        />
    );
};

export { TextFormField };