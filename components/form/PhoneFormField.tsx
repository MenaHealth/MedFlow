import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CountryCodesList } from '@/data/countries.enum'; // Assuming this is a string enum or array

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
    const [countryCode, setCountryCode] = useState<CountryCodes | undefined>(undefined); // Default to undefined
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCodeError, setCountryCodeError] = useState<string | null>(null); // To track the error state

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value as CountryCodes;
        setCountryCode(selectedCode);

        // Clear the error if a country code is selected
        if (selectedCode) {
            setCountryCodeError(null);
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Strip all non-numeric characters
        setPhoneNumber(rawValue);

        if (countryCode) {
            const fullPhoneNumber = `${countryCode}${rawValue}`;
            form.setValue(fieldName, fullPhoneNumber, { shouldValidate: true }); // Save the full phone number (country code + number)
        }
    };

    const handleValidation = () => {
        // Ensure that a country code is selected
        if (!countryCode) {
            setCountryCodeError('Country code is required');
            return false;
        }

        return true;
    };

    useEffect(() => {
        const initialValue = form.getValues(fieldName);
        if (initialValue) {
            const code = initialValue.slice(0, initialValue.indexOf(' ') + 1);
            const number = initialValue.slice(initialValue.indexOf(' ') + 1);
            setCountryCode(code as CountryCodes || undefined);
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
                            value={countryCode || ''}
                            onChange={handleCountryCodeChange}
                            onBlur={handleValidation} // Validate onBlur
                            className={`p-2 border rounded-l-md ${countryCodeError ? 'border-red-500' : ''}`}
                        >
                            <option value="" disabled>
                                
                            </option>
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
                    {/* Show error message if country code is not selected */}
                    {countryCodeError && <p className="text-red-500 text-sm">{countryCodeError}</p>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
