import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function SingleChoiceFormField({ fieldName, fieldLabel, choices }) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                        >
                            {choices.map((choice) => {
                                const id = `${fieldName}-${choice}`;
                                return (
                                    <FormItem className="flex items-center space-x-3 space-y-0" key={choice}>
                                        <FormControl>
                                            <RadioGroupItem
                                                value={choice}
                                                id={id}
                                            />
                                        </FormControl>
                                        <Label htmlFor={id}>{choice}</Label>
                                    </FormItem>
                                );
                            })}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}