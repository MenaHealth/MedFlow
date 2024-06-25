
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function ImagesUpload({ form, fieldName, fieldLabel }: { form: any, fieldName: string, fieldLabel: string }) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Input {...fieldProps} id={fieldLabel} type="file" multiple onChange={(event) =>
                            onChange(event.target.files)
                        } />
                    </FormControl>
                </FormItem>
            )} />
    );
};