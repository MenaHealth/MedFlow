
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

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