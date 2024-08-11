// components/form/NumericalFormField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function NumericalFormField({ form, fieldName, fieldLabel }: { form: any; fieldName: string; fieldLabel: string }) {
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
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)} // Parse the input value as integer
                            type="number"
                            min={0}
                            step={1}
                            className="w-full"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
