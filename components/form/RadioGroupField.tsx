
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import {
    RadioGroup,
    RadioGroupItem,
  } from "@/components/ui/radio-group"

export function RadioGroupField({ form, fieldName, fieldLabel, radioOptions }: { form: any, fieldName: string, fieldLabel?: string, radioOptions: string[] }) {
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldLabel}</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange}>
              {radioOptions.map((option, i) => (
                <span key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <FormDescription>{option}</FormDescription>
                </span>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
        )}
      />
    );
}