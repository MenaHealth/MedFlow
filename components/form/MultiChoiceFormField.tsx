
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function MultiChoiceFormField({ form, fieldName, fieldLabel, choices, custom, cols = 1, defaultValue, onRadioChange }: { form: any, fieldName: string, fieldLabel: string, choices: string[], custom: boolean, cols?: number, defaultValue?: string, onRadioChange?: (value: string) => void }) {
    // let cols = window.innerWidth >= 1024 ? 3 : 1;
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{fieldLabel}</FormLabel>
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
                                {choices.map((choice) => (
                                    <div className="flex items-center space-x-2" key={choice}>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={choice} id={choice} />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {choice}
                                            </FormLabel>
                                        </FormItem>
                                    </div>
                                ))}
                            </div>
                            {custom && (
                                <div className="flex items-center">
                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={"other"} id={"other"} />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Custom:
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                document.getElementById("custom" + fieldName)?.click();
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