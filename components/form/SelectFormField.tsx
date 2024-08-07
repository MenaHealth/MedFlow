// components/form/SelectFormField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function SelectFormField({ fieldName, fieldLabel, selectOptions }: { fieldName: string; fieldLabel: string; selectOptions: string[] }) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || selectOptions[0]}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {selectOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}