
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

export function SelectFormField({ form, fieldName, fieldLabel }: { form: any, fieldName: string, fieldLabel: string }) {
    return (
        <FormField
          control={form.control}
          name="baselineAmbu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baseline Ambu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Baseline ambu." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Independent">Independent</SelectItem>
                  <SelectItem value="Boot">Boot</SelectItem>
                  <SelectItem value="Crutches">Crutches</SelectItem>
                  <SelectItem value="Walker">Walker</SelectItem>
                  <SelectItem value="NonAmbulatory">Non-Ambulatory</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
    );
}