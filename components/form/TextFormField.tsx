
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function TextFormField({form, fieldName, fieldLabel, className}: {form: any, fieldName: string, fieldLabel: string, className?: string}) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Input {...field} className="w-full" />
                    </FormControl>
                </FormItem>
            )}/>
    );
};