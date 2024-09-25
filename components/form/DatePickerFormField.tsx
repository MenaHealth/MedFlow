// components/form/DatePickerFormField.tsx

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils"
import { format } from "date-fns";

export function DatePopover({ field }: { field: any }) {
    return (<Popover>
        <PopoverTrigger asChild>
            <FormControl>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                    )}
                >
                    {field.value ? (
                        format(field.value, "PPP")
                    ) : (
                        <span>Pick a date</span>
                    )}
                    {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                </Button>
            </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                    date < new Date("1900-01-01") // Only disables dates before 1900
                }
                initialFocus
            />
        </PopoverContent>
    </Popover>)
}

export function DatePickerFormField({ form, fieldName, fieldLabel }: { form: any, fieldName: string, fieldLabel: string }) {
    return (
        <FormField
            control={form.control}
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