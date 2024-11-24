// components/form/TextAreaFormField.tsx
import { FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function TextAreaFormField({ form, fieldName, fieldLabel, className, defaultValue, error }: { form: any, fieldName: string, fieldLabel: string, className?: string, defaultValue?: string, error?: string }) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    
    return (
        <>
            <FormField
                control={form.control}
                name={fieldName}
                render={({ field: { value, ...field } }) => (
                    <FormItem className={className}>
                        <div className="relative">
                            <Textarea
                                {...field}
                                className="w-full"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                defaultValue={defaultValue}
                            />
                            <label className={`absolute transition-all ${(isFocused || (value !== '')) ? 'text-xs -top-5' : 'text-sm top-1/2 -translate-y-1/2'} left-2`}>{fieldLabel}</label>
                        </div>
                    </FormItem>
                )} />
                <div className="text-sm text-red-500" style={{marginTop: '5px'}}>{error}</div>
        
        </>
    );
}