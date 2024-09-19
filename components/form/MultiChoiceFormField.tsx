import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function MultiChoiceFormField({ fieldName, fieldLabel, choices }) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <div className="space-y-2">
                        {choices.map((item) => (
                            <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                                ? [...(field.value || []), item]
                                                : (field.value || []).filter((value) => value !== item);
                                            field.onChange(updatedValue);
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item}
                                </FormLabel>
                            </FormItem>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}