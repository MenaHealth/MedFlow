// components/form/TextFormField.tsx
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function TextFormField({ fieldName, fieldLabel }: { fieldName: string; fieldLabel: string }) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}