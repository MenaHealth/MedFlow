
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
                            {...field}
                            type="number"
                        // onKeyPress={(event) => {
                        //     if (!/[0-9]/.test(event.key)) {
                        //     event.preventDefault();
                        //     }
                        // }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}