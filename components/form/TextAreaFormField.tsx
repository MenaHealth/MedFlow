import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export function TextAreaFormField({form, fieldName, fieldLabel}: {form: any, fieldName: string, fieldLabel: string}) {
    return (
        <FormField
        control={form.control}
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


