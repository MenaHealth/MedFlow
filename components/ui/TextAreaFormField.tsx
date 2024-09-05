// components/form/TextAreaFormField.tsx
import { FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export function TextAreaFormField({ form, fieldName, fieldLabel, className }: { form: any, fieldName: string, fieldLabel: string, className?: string }) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field: { value, ...field } }) => (
                <FormItem className={className}>
                    <div className="relative">
                        <Textarea
                            {...field}
                            className="w-full"
                        />
                        <label className={`absolute transition-all ${value !== '' ? 'text-xs -top-2' : 'text-sm top-1/2 -translate-y-1/2'} left-2`}>{fieldLabel}</label>
                    </div>
                </FormItem>
            )} />
    );
}