// components/form/PhoneFormField.tsx
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export function PhoneFormField({
                                   form,
                                   fieldName,
                                   fieldLabel,
                               }: {
    form: any;
    fieldName: string;
    fieldLabel: string;
}) {
    const [inputValue, setInputValue] = useState('');

    const formatphone = (value: string) => {
        // Remove all non-digit characters
        const phone = value.replace(/\D/g, '');
        const phoneLength = phone.length;

        // Format the phone number to the desired format
        if (phoneLength === 0) return '';
        if (phoneLength < 4) return `+${phone}`;
        if (phoneLength < 7)
            return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4)}`;
        if (phoneLength < 11)
            return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 11)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Strip all non-numeric characters
        const formattedNumber = formatphone(rawValue);
        setInputValue(formattedNumber);
        form.setValue(fieldName, formattedNumber, { shouldValidate: true }); // Save the formatted number
    };

    useEffect(() => {
        const initialValue = form.getValues(fieldName);
        if (initialValue) {
            setInputValue(formatphone(initialValue));
        }
    }, [form, fieldName]);

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <input
                            {...field}
                            type="tel"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="+1 (234) 567-8910"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}