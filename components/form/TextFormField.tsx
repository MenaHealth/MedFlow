import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function TextFormField({form, fieldName, fieldLabel}: {form: any, fieldName: string, fieldLabel: string}) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                </FormItem>
        )}/>
    );
};