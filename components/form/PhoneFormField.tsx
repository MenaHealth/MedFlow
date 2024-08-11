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

    const formatPhoneNumber = (value: string) => {
        // Remove all non-digit characters
        const phoneNumber = value.replace(/\D/g, '');
        const phoneNumberLength = phoneNumber.length;

        // Format based on the length of the input
        if (phoneNumberLength === 0) return '';
        if (phoneNumberLength < 4) return `+${phoneNumber}`;
        if (phoneNumberLength < 7)
            return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`;
        return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
            4,
            7
        )}-${phoneNumber.slice(7, 11)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Strip all non-numeric characters
        const formattedNumber = formatPhoneNumber(rawValue);
        setInputValue(formattedNumber);
        form.setValue(fieldName, rawValue, { shouldValidate: true }); // Save only numeric digits
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && inputValue.length > 0) {
            // Remove formatting when backspacing
            const newRawValue = inputValue.replace(/\D/g, '').slice(0, -1); // Remove the last character
            const formattedNumber = formatPhoneNumber(newRawValue);
            setInputValue(formattedNumber);
            form.setValue(fieldName, newRawValue, { shouldValidate: true });
            e.preventDefault(); // Prevent default backspace behavior
        }
    };

    useEffect(() => {
        const initialValue = form.getValues(fieldName);
        if (initialValue) {
            setInputValue(formatPhoneNumber(initialValue));
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
                            onKeyDown={handleKeyDown}
                            className="w-full p-2 border rounded"
                            placeholder="+1 (123) 456-7890"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}