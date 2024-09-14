import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function MultiChoiceFormField({ fieldName, fieldLabel, choices, custom, cols = 1, defaultValue, onRadioChange }) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <Label>{fieldLabel}</Label>
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => {
                                if (value !== "custom") {
                                    field.onChange(value);
                                }
                                if (onRadioChange) {
                                    onRadioChange(value);
                                }
                            }}
                            defaultValue={defaultValue ?? field.value}
                            className="flex flex-col space-y-1"
                        >
                            <div className={`grid gap-4 sm:grid-cols-${cols}`}>
                                {choices.map((choice) => {
                                    const id = `${fieldName}-${choice}`;
                                    return (
                                        <div className="flex items-center space-x-2" key={choice}>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={choice}
                                                        id={id}
                                                        name={fieldName}
                                                    />
                                                </FormControl>
                                                <Label htmlFor={id} className="font-normal">
                                                    {choice}
                                                </Label>
                                            </FormItem>
                                        </div>
                                    );
                                })}
                            </div>
                            {custom && (
                                <div className="flex items-center">
                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem
                                                value="other"
                                                id={`${fieldName}-other`}
                                                name={fieldName}
                                            />
                                        </FormControl>
                                        <Label htmlFor={`${fieldName}-other`} className="font-normal">
                                            Custom:
                                        </Label>
                                        <Input
                                            type="text"
                                            id={`${fieldName}-custom-input`}
                                            name={`${fieldName}-custom`}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                document.getElementById(`${fieldName}-other`)?.click();
                                            }}
                                        />
                                    </FormItem>
                                </div>
                            )}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};