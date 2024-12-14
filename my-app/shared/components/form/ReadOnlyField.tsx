import React from 'react';

interface Props {
    fieldName: string;
    fieldLabel: string;
    value: string;
    className?: string;
}

export default function ReadOnlyField({
                                          fieldName,
                                          fieldLabel,
                                          value,
                                          className,
                                      }: Props) {
    const id = `${fieldName}-input`;

    return (
        <div className={`mt-6 mb-6 p-2 ${className}`}>
            <div className="relative">
                <label
                    htmlFor={id}
                    className="absolute text-xs -top-6 left-2 pointer-events-none"
                >
                    {fieldLabel}
                </label>
                <div
                    id={id}
                    className="w-full pt-2 pb-2 pl-2 pr-10 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                >
                    {value}
                </div>
            </div>
        </div>
    );
}