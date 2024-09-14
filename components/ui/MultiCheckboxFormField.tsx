// components/ui/MultiCheckboxFormField.tsx
import { useFormContext } from "react-hook-form";
import {FormField, FormItem} from "@/components/ui/form";
import {Checkbox, FormLabel} from "@mui/material";

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

    const { getValues, setValue } = form;

    return (
        <FormField>
            <FormItem className="space-y-3">
                <FormLabel>{fieldLabel}</FormLabel>
                <div className="flex flex-col space-y-2">
                    {choices.map((choice) => (
                        <div key={choice} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${id}-${choice}`}
                                checked={getValues(fieldName).includes(choice)}
                                onCheckedChange={(checked) => {
                                    const currentValues = getValues(fieldName);
                                    if (checked) {
                                        setValue(fieldName, [...currentValues, choice]);
                                    } else {
                                        setValue(fieldName, currentValues.filter((value) => value !== choice));
                                    }
                                }}
                            />
                            <FormLabel htmlFor={`${id}-${choice}`}>{choice}</FormLabel>
                        </div>
                    ))}
                </div>
            </FormItem>
        </FormField>
    );
};

export default MultiCheckboxFormField;