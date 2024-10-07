import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import * as Form from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EyeOff, Eye } from "lucide-react";

interface PasswordFormFieldProps {
    fieldName: string;
    fieldLabel: string;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    error?: string;
    disabled?: boolean;
}

const PasswordFormField: React.FC<PasswordFormFieldProps> = ({
                                                                 fieldName,
                                                                 fieldLabel,
                                                                 className,
                                                                 onFocus,
                                                                 onBlur,
                                                                 error,
                                                                 disabled,
                                                             }) => {
    const { control, watch } = useFormContext();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const id = `${fieldName}-input`;
    const value = watch(fieldName);
    const isValid = /^(?=.*[0-9]).{8,}$/.test(value || '');

    const handleFocus = () => {
        setIsFocused(true);
        setShowTooltip(true);
        if (onFocus) onFocus();
    };

    const handleBlur = () => {
        setIsFocused(false);
        setShowTooltip(false);
        if (onBlur) onBlur();
    };

    return (
        <Form.FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <Form.FormItem className={`mb-6 p-2 ${className}`}>
                    <div className="relative">
                        <Input
                            {...field}
                            type={isPasswordVisible ? 'text' : 'password'}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            id={id}
                            disabled={disabled}
                            className={`w-full pt-4 pb-2 pl-2 pr-10 border ${
                                isValid ? 'border-orange-500' : 'border-gray-300'
                            } ${isFocused || field.value ? 'bg-white' : ''} ${
                                !isValid && field.value ? 'text-orange-700' : ''
                            }`}
                        />
                        <Form.FormLabel htmlFor={id} className={`absolute transition-all ${
                            (isFocused || field.value) ? 'text-xs -top-6' : 'text-sm top-1/2 -translate-y-1/2'
                        } left-2 pointer-events-none`}>
                            {fieldLabel}
                        </Form.FormLabel>
                        <button
                            type="button"
                            onMouseDown={() => setIsPasswordVisible(true)}
                            onMouseUp={() => setIsPasswordVisible(false)}
                            onMouseLeave={() => setIsPasswordVisible(false)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            tabIndex={-1}
                        >
                            {isPasswordVisible ? (
                                <Eye className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeOff className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                        {showTooltip && (
                            <div className="absolute left-0 top-full w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                                Eight or more characters and at least one number
                            </div>
                        )}
                    </div>
                    {error && <Form.FormMessage>{error}</Form.FormMessage>}
                </Form.FormItem>
            )}
        />
    );
};

export default PasswordFormField;