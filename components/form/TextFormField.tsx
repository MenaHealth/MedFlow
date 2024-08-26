// components/form/TextFormField.tsx
import { useState } from 'react';
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {isDirty } from "zod";

export function TextFormField({ form, fieldName, fieldLabel, className, type }: { form: any, fieldName: string, fieldLabel: string, className?: string, type?: string }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsPasswordVisible(true);
    };

    const handleMouseLeave = () => {
        setIsPasswordVisible(false);
    };

    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field: { value, ...field } }) => (
                <FormItem className={`mb-6 p-2 ${className}`}>
                    <div className="relative">
                        <Input
                            {...field}
                            type={inputType}
                            className={`w-full pt-4 pb-2 pl-2 pr-10 ${isDirty ? 'focused' : ''}`}
                        />
                        <label className={`absolute transition-all ${value !== '' ? 'text-xs -top-6' : 'text-sm top-1/2 -translate-y-1/2'} left-2 pointer-events-none`}>{fieldLabel}</label>
                        {type === 'password' && (
                            <button
                                type="button"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                {isPasswordVisible ? <EyeOpenIcon className="h-5 w-5 text-gray-500" /> : <EyeClosedIcon className="h-5 w-5 text-gray-500" />}
                            </button>
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
};