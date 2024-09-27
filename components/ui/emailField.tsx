import React, { useState } from 'react';
import * as Form from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Props {
    form: any;
    fieldName: string;
    fieldLabel: string;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    error?: string;
    disabled?: boolean;
}

const EmailField = ({
                        form,
                        fieldName,
                        fieldLabel,
                        className,
                        onFocus,
                        onBlur,
                        error,
                        disabled,
                    }: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const id = `${fieldName}-input`;

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        <Form.FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => {
                const handleChange = (event: any) => {
                    field.onChange(event);
                    setIsValidEmail(emailRegex.test(event.target.value));  // Check for email validity
                };

                return (
                    <Form.FormItem className={`mb-6 p-2 ${className}`}>
                        <div className="relative">
                            <Input
                                {...field}
                                type="text"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id={id}
                                autoComplete={"email"}
                                className={`w-full pt-4 pb-2 pl-2 pr-10 border ${
                                    isValidEmail ? 'border-orange-500' : 'border-gray-300'
                                } ${isFocused || field.value ? 'bg-white' : ''} ${
                                    !isValidEmail && field.value ? 'text-orange-700' : ''
                                }`}
                            />
                            <Form.FormLabel
                                htmlFor={id}
                                className={`absolute transition-all ${
                                    isFocused || field.value ? 'text-xs -top-6' : 'text-sm top-1/2 -translate-y-1/2'
                                } left-2 pointer-events-none`}
                            >
                                {fieldLabel}
                            </Form.FormLabel>
                            {showTooltip && (
                                <div className="absolute left-0 top-full w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                                    Enter a valid email address (e.g., example@domain.com)
                                </div>
                            )}
                        </div>
                    </Form.FormItem>
                );
            }}
        />
    );
};

export default EmailField;