import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CountryCodesList } from '@/data/countries.enum'; // Assuming this is a string enum or array

// Define the type based on the structure of CountryCodesList
type CountryCodes = typeof CountryCodesList[number]; // Infers the type from the array or enum

export function PhoneFormField({
    form,
    fieldName,
    fieldLabel,
}: {
    form: any;
    fieldName: string;
    fieldLabel: string;
}) {
    const [countryCode, setCountryCode] = useState<CountryCodes>(CountryCodesList[0]); // Type it properly
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryCode(e.target.value as CountryCodes); // Ensure the value is cast to the correct type
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Strip all non-numeric characters
        setPhoneNumber(rawValue);
        const fullPhoneNumber = `${countryCode}${rawValue}`;
        form.setValue(fieldName, fullPhoneNumber, { shouldValidate: true }); // Save the full phone number (country code + number)
    };

    useEffect(() => {
        const initialValue = form.getValues(fieldName);
        if (initialValue) {
            const code = initialValue.slice(0, initialValue.indexOf(' ') + 1);
            const number = initialValue.slice(initialValue.indexOf(' ') + 1);
            setCountryCode(code as CountryCodes || CountryCodesList[0]);
            setPhoneNumber(number || '');
        }
    }, [form, fieldName]);

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <div className="flex items-center">
                        {/* Country Code Dropdown */}
                        <select
                            value={countryCode}
                            onChange={handleCountryCodeChange}
                            className="p-2 border rounded-l-md"
                        >
                            {CountryCodesList.map((code) => (
                                <option key={code} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>

                        {/* Phone Number Input */}
                        <input
                            {...field}
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className="w-full p-2 border rounded-r-md"
                            placeholder="1234567890"
                        />
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
