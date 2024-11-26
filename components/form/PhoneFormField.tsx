import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { CountryCodesList } from '@/data/countries.enum'; // Assuming this is a string enum or array

type CountryCodes = typeof CountryCodesList[number]; // Infers the type from the array or enum

export function PhoneFormField({
    form,
    fieldName,
    fieldLabel,
    defaultValue,
    countryCodeError,
    classNames
}: {
    form: any;
    fieldName: string;
    fieldLabel: string;
    defaultValue?: { countryCode: string; phoneNumber: string };
    countryCodeError?: string;
    classNames?: string;
}) {
    const [countryCode, setCountryCode] = useState<CountryCodes | undefined>(defaultValue?.countryCode as CountryCodes); // Default to undefined or the initial value
    const [phoneNumber, setPhoneNumber] = useState(defaultValue?.phoneNumber || '');

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value as CountryCodes;
        setCountryCode(selectedCode);

        // Clear the error if a country code is selected
        if (selectedCode) {
            form.clearErrors(fieldName);
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Strip all non-numeric characters
        setPhoneNumber(rawValue);

        if (countryCode) {
            form.setValue(fieldName, { countryCode, phoneNumber: rawValue }, { shouldValidate: true }); 
        }
    };

    const handleValidation = () => {
        // Ensure that a country code is selected
        if (!countryCode) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        const initialValue = form.getValues(fieldName);
        if (initialValue) {
            setCountryCode(initialValue.countryCode || undefined);
            setPhoneNumber(initialValue.phoneNumber || '');
        }
    }, [form, fieldName]);

    return (
        <div className={classNames}>
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
                                value={phoneNumber} // Bind to phoneNumber state
                                onChange={(e) => {
                                    field.onChange(e); // Call form field's onChange
                                    handlePhoneNumberChange(e); // Also call your custom handler
                                }}
                                className="w-full p-2 border rounded-r-md"
                                placeholder="1234567890"
                            />
                        </div>
                        {/* Show error message if country code is not selected */}
                        {countryCodeError && <p className="text-red-500 text-sm">{countryCodeError}</p>}
                    </FormItem>
                )}
            />
        </div>
    );
}
