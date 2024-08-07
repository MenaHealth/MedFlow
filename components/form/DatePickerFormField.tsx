// components/form/DatePickerFormField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

// Separate component for date popover
export function DatePopover({ field }: { field: any }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

export function DatePickerFormField({ fieldName, fieldLabel }: { fieldName: string; fieldLabel: string }) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <DatePopover field={field} />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}