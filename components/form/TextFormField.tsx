import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function TextFormField({ form, fieldName, fieldLabel, defaultValue, classNames }: { form: any, fieldName: string, fieldLabel: string, defaultValue?: string, classNames?: string }) {
    return (
        <div className={classNames}>
            <FormField
                control={form.control}
                name={fieldName}
                render={({ field }) => {
                    if (!field.value && defaultValue) {
                        field.value = defaultValue;
                    }

                    return (
                        <FormItem>
                            <FormLabel>{fieldLabel}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    );
                }}
            />
        </div>
    );
};
