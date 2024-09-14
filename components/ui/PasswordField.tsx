import { useState } from 'react';
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
            render={({ field }) => (
                <Form.FormItem className={`mb-6 p-2 ${className}`}>
                    <div className="relative">
                        <Input
                            {...field}
                            type={isPasswordVisible ? 'text' : 'password'}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            id={id}
                            className={`w-full pt-4 pb-2 pl-2 pr-10 ${
                                isFocused || field.value ? 'bg-white' : ''
                            }`}
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
                            <div className="absolute left-0 bottom-full mt-2 w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                                Eight or more characters and at least one number
                            </div>
                        )}
                    </div>
                </Form.FormItem>
            )}
        />
    );
};

export default PasswordField;