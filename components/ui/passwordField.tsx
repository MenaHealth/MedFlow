import { useState, useEffect } from 'react';
import * as Form from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

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

const PasswordField = ({
                           form,
                           fieldName,
                           fieldLabel,
                           className,
                           onFocus,
                           onBlur,
                           error,
                           disabled,
                       }: Props) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isValid, setIsValid] = useState(false);

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

    return (
        <Form.FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => {
                const handleChange = (event: any) => {
                    field.onChange(event);
                    const regex = /^(?=.*[0-9]).{8,}$/;
                    setIsValid(regex.test(event.target.value));  // Check for password validity
                };

                return (
                    <Form.FormItem className={`mb-6 p-2 ${className} ${isValid ? 'bg-yellow-100' : ''}`}>
                        <div className="relative">
                            <Input
                                {...field}
                                type={isPasswordVisible ? 'text' : 'password'}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id={id}
                                className={`w-full pt-4 pb-2 pl-2 pr-10 ${
                                    isFocused || field.value ? 'bg-white' : ''
                                } ${!isValid && field.value ? 'text-orange-700' : ''}`}
                            />
                            <Form.FormLabel htmlFor={id} className={`absolute transition-all ${
                                (isFocused || field.value) ? 'text-xs -top-6' : 'text-sm top-1/2 -translate-y-1/2'
                            } left-2 pointer-events-none`}>
                                {fieldLabel}
                            </Form.FormLabel>
                            <button
                                type="button"
                                onMouseEnter={() => setIsPasswordVisible(true)}
                                onMouseLeave={() => setIsPasswordVisible(false)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                tabIndex={-1}
                            >
                                {isPasswordVisible ? (
                                    <EyeOpenIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeClosedIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                            {showTooltip && (
                                <div className="absolute left-0 top-full w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                                    Eight or more characters and at least one number
                                </div>
                            )}
                        </div>
                    </Form.FormItem>
                );
            }}
        />
    );
};

export default PasswordField;