// components/form/NumericalFormField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function NumericalFormField({ form, fieldName, fieldLabel }: { form: any, fieldName: string, fieldLabel: string }) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            type="number"
                            min={0}
                            step={1}
                            onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? '' : parseInt(value, 10));
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
