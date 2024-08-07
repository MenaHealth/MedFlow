// components/form/NumericalFormField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from "react-hook-form";

export function NumericalFormField({ fieldName, fieldLabel }: { fieldName: string; fieldLabel: string }) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type="number"
                            min={0}
                            step={1}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}