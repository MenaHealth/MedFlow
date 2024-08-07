// components/form/TextAreaFormField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from "react-hook-form";

export function TextAreaFormField({ fieldName, fieldLabel }: { fieldName: string; fieldLabel: string }) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}