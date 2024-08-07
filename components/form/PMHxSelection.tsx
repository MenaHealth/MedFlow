// components/form/PMHxSelect.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export function PMHxSelect({ fieldName, fieldLabel, fieldCompact, PopOverComponent }:
                               { fieldName: string, fieldLabel: string, fieldCompact: string, PopOverComponent: any }) {
    const { control, setValue } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <div className="flex flex-col gap-4">
                    <Label>{fieldLabel}</Label>
                    {field.value.map((fieldObj: any, index: number) => (
                        <div className="l:flex-row xl:flex items-center space-x-3" key={index}>
                            <FormLabel>{fieldCompact + " " + (index + 1)}</FormLabel>
                            <FormItem className="flex-auto">
                                <FormControl>
                                    <Input
                                        className="flex-1 w-full"
                                        key={"pmhx" + index}
                                        placeholder='PMHx'
                                        onChange={(event) => {
                                            setValue(fieldName, field.value.map((pmhx: any, i: number) => {
                                                if (i === index) {
                                                    return event.target.value;
                                                }
                                                return pmhx;
                                            }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Button type="button" onClick={() =>
                                setValue(fieldName, field.value.filter((pmhx: any, i: number) => i !== index))
                            }>Remove</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() =>
                        setValue(fieldName, [...field.value, ""])
                    }>Add PMHx</Button>
                </div>
            )}
        />
    );
}