import { useFormContext, Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@mui/material";

interface MultiCheckboxFormFieldProps {
    fieldName: string;
    fieldLabel: string;
    choices: string[];
    id: string;
}

const MultiCheckboxFormField = ({
                                    fieldName,
                                    fieldLabel,
                                    choices,
                                    id,
                                }: MultiCheckboxFormFieldProps) => {
    const form = useFormContext();

    if (!form) {
        return null;
    }

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <div className="flex flex-col space-y-2">
                        {choices.map((choice) => (
                            <div key={choice} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${id}-${choice}`}
                                    checked={field.value?.includes(choice) || false}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        const currentValues = field.value || [];
                                        if (checked) {
                                            field.onChange([...currentValues, choice]);
                                        } else {
                                            field.onChange(currentValues.filter((value: string) => value !== choice));
                                        }
                                    }}
                                />
                                <FormLabel htmlFor={`${id}-${choice}`}>{choice}</FormLabel>
                            </div>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default MultiCheckboxFormField;