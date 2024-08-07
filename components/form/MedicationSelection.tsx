// components/form/MedicationSelection.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicationPopover } from './MedicationPopover';
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export function MedicationSelection({ fieldName, fieldLabel }: { fieldName: string; fieldLabel: string }) {
    const { control, setValue } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <div className="flex flex-col gap-4">
                    <Label>Medications Needed</Label>
                    {field.value.map((medicine: any, index: number) => (
                        <div className="l:flex-row xl:flex items-center space-x-3" key={index}>
                            <FormLabel>{fieldLabel.slice(0, 3) + " " + (index + 1)}</FormLabel>
                            <FormItem>
                                <FormControl>
                                    <MedicationPopover field={field} index={index} fieldName={fieldName} fieldLabel={fieldLabel} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="flex-1"
                                        key={"medDosage" + index}
                                        placeholder="dosage"
                                        onChange={(event) => {
                                            setValue(fieldName, field.value.map((med: any, i: number) => {
                                                if (i === index) {
                                                    return { ...med, medDosage: event.target.value };
                                                }
                                                return med;
                                            }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="flex-1"
                                        key={"medFrequency" + index}
                                        placeholder="frequency"
                                        onChange={(event) => {
                                            setValue(fieldName, field.value.map((med: any, i: number) => {
                                                if (i === index) {
                                                    return { ...med, medFrequency: event.target.value };
                                                }
                                                return med;
                                            }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Button type="button" onClick={() => setValue(fieldName, field.value.filter((med: any, i: number) => i !== index))}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => setValue(fieldName, [...field.value, { medName: "", medDose: "", medFrequency: "" }])}>
                        Add Medicine
                    </Button>
                </div>
            )}
        />
    );
}