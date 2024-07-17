
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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
                            {...field.value}
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