
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// import { MedicationPopover } from './MedicationPopover';
import { Label } from "@/components/ui/label"

export function PSHxSelect({ form, fieldName, fieldLabel, fieldCompact, PopOverComponent }:
    { form: any, fieldName: string, fieldLabel: string, fieldCompact: string, PopOverComponent: any }) {

    return (
        <>
            <FormField
                control={form.control}
                name={fieldName}
                render={({ field }) => (<>

                    <div className="flex flex-col gap-4">
                        <Label>{fieldLabel}</Label>
                        {field.value.map((fieldObj: any, index: number) => (
                            <div className="l:flex-row xl:flex items-center space-x-3" key={index}>
                            <FormLabel>{fieldCompact + " " + (index+1)}</FormLabel>
                            <FormItem className="flex-auto">
                                <FormControl>
                                    <Input className="flex-1" key={"pshx"+index} placeholder='PSHx' onChange={(event) => {
                                        form.setValue(fieldName, field.value.map((pshx: any, i: number) => {
                                            if (i === index) {
                                                return event.target.value;
                                            }
                                            return pshx;
                                        }));
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                                <Button type="button" onClick={
                                    () => form.setValue(fieldName, field.value.filter((pshx: any, i: number) => i !== index))
                                }>Remove</Button>
                            </div>
                        ))}
                        <Button type="button" onClick={
                            () => form.setValue(fieldName, [...field.value, ""])
                        }>Add PSHx</Button>
                    </div>
                </>)}
            />
        </>
    );
}