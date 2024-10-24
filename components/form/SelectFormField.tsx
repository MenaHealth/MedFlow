
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

export function SelectFormField({ form, fieldName, fieldLabel, selectOptions, defaultValue, classNames }: { form: any, fieldName: string, fieldLabel: string, selectOptions: string[], defaultValue?: string, classNames?: string}) {
    return (
      <div className={classNames}>
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldLabel}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={defaultValue}>
            <FormControl>
              <SelectTrigger>
              <SelectValue/>
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
      </div>
    );
}