
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import Link from "next/link"

export function SelectFormField({ form, fieldName, fieldLabel, selectOptions }: { form: any, fieldName: string, fieldLabel: string, selectOptions: string[] }) {
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldLabel} {field.value}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value ? field.value : selectOptions[1]}>
          <FormControl>
            <SelectTrigger>
            <SelectValue placeholder="Left" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {selectOptions.map((option) => (
            <SelectItem key={option} value={option} >
              {option}
            </SelectItem>
            ))}
          </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
        )}
      />
    );
}