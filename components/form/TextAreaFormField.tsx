// components/form/TextFormField.tsx
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function TextFormField({form, fieldName, fieldLabel, className, type}: {form: any, fieldName: string, fieldLabel: string, className?: string, type?: string}) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field: { value, ...field } }) => (
                <FormItem className={className}>
                    <div className="relative">
                        <Input
                            {...field}
                            type={type}
                            className="w-full pt-4"
                        />
                        <label className={`absolute transition-all ${value !== '' ? 'text-xs -top-2' : 'text-sm top-1/2 -translate-y-1/2'} left-2`}>{fieldLabel}</label>
                    </div>
                </FormItem>
            )}/>
    );
};