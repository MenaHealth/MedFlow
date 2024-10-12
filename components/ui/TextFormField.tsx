import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
    fieldName: string;
    fieldLabel: string;
    className?: string;
    type?: string;
    tooltip?: string;
    showTooltip?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    error?: string;
    disabled?: boolean;
    autoComplete?: string;
    id?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    multiline?: boolean;
    rows?: number;
}

const TextFormField: React.FC<Props> = ({
                                            fieldName,
                                            fieldLabel,
                                            className,
                                            type = 'text',
                                            tooltip,
                                            showTooltip,
                                            onFocus,
                                            onBlur,
                                            autoComplete,
                                            error,
                                            value,
                                            onChange,
                                            multiline,
                                            rows,
                                        }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const formContext = useFormContext();

    const id = `${fieldName}-input`;

    useEffect(() => {
        setHasValue(!!value);
    }, [value]);

    const handleFocus = () => {
        setIsFocused(true);
        if (onFocus) onFocus();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(false);
        if (e?.target) {
            setHasValue(!!e.target.value);
        }
        if (onBlur) onBlur();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setHasValue(!!e.target.value);
        if (onChange) onChange(e);
    };

    const renderInput = ({ field }: any) => (
        <div className={`mt-6 mb-6 p-2 ${className}`}>
            <div className="relative">
                {multiline ? (
                    <textarea
                        {...field}
                        onFocus={handleFocus}
                        onBlur={(e) => {
                            field.onBlur();
                            handleBlur(e);
                        }}
                        value={value !== undefined ? value : field.value}
                        onChange={(e) => {
                            field.onChange(e);
                            handleChange(e);
                        }}
                        id={id}
                        name={fieldName}
                        autoComplete={autoComplete}
                        className={`w-full pt-4 pb-2 pl-2 pr-10 border-2 ${isFocused || hasValue ? 'border-darkBlue' : 'border-gray-300'} rounded-md text-gray-700 hover:border-orange-500`}
                        rows={rows || 2}
                    />
                ) : (
                    <Input
                        {...field}
                        onFocus={handleFocus}
                        onBlur={(e) => {
                            field.onBlur();
                            handleBlur(e);
                        }}
                        value={value !== undefined ? value : field.value}
                        onChange={(e) => {
                            field.onChange(e);
                            handleChange(e);
                        }}
                        id={id}
                        name={fieldName}
                        autoComplete={autoComplete}
                        className={`w-full pt-4 pb-2 pl-2 pr-10 border-2 hover:border-orange-500 border-gray-300 rounded-md text-gray-700 ${
                            isFocused || hasValue ? 'border-darkBlue' : ''
                        }`}
                    />
                )}

                <label
                    htmlFor={id}
                    className={`absolute transition-all duration-200 ${
                        (isFocused || hasValue) ? 'text-xs -top-2 left-2 bg-white px-1' : 'text-sm top-1/2 left-2 -translate-y-1/2'
                    } pointer-events-none`}
                    style={{
                        transformOrigin: 'left center',
                    }}
                >
                    {fieldLabel}
                </label>


                {showTooltip && tooltip && (
                    <div className="absolute left-0 bottom-full mt-2 w-full bg-gray-700 text-white text-sm p-2 rounded shadow-lg z-10">
                        {tooltip}
                    </div>
                )}
            </div>
            {error && <p className="text-orange-600 text-sm mt-1">{error}</p>}
        </div>
    );

    if (formContext) {
        return (
            <Controller
                name={fieldName}
                render={renderInput}
            />
        );
    }

    return renderInput({ field: { value: value || '', onChange: handleChange, onBlur: handleBlur } });
};

export { TextFormField };