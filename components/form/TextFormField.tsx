import { useState } from 'react';
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export function TextFormField({
                                  form,
                                  fieldName,
                                  fieldLabel,
                                  className,
                                  type,
                                  tooltip,
                                  showTooltip,
                                  onFocus,
                                  onBlur,
                              }: {
    form: any;
    fieldName: string;
    fieldLabel: string;
    className?: string;
    type?: string;
    tooltip?: string;
    showTooltip?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        if (onFocus) onFocus();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (onBlur) onBlur();
    };

    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className={`mb-6 p-2 ${className}`}>
                    <div className="relative">
                        <Input
                            {...field}
                            type={inputType}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={`w-full pt-4 pb-2 pl-2 pr-10`}
                        />
                        <label
                            className={`absolute transition-all ${
                                (isFocused || field.value) ? 'text-xs -top-6' : 'text-sm top-1/2 -translate-y-1/2'
                            } left-2 pointer-events-none`}
                        >
                            {fieldLabel}
                        </label>
                        {type === 'password' && (
                            <button
                                type="button"
                                onMouseEnter={() => setIsPasswordVisible(true)}
                                onMouseLeave={() => setIsPasswordVisible(false)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                {isPasswordVisible ? (
                                    <EyeOpenIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeClosedIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        )}
                        {showTooltip && tooltip && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                                {tooltip}
                            </div>
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
}