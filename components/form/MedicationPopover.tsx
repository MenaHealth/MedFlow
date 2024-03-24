import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import * as React from "react"
import { cn } from "@/lib/utils"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"


export function MedicationPopover({ form, field, index, fieldName, fieldLabel }: { form: any, field: any, index: number, fieldName: string, fieldLabel: string }) {
    const medicines = ["Medicine 1", "Medicine 2", "Medicine 3", "Medicine 4", "Medicine 5"];

    const [search, setSearch] = React.useState('');

    return (
        <Popover>
            <PopoverTrigger asChild>
            <FormControl >
                <Button variant="outline" role="combobox" className={cn(
                    "w-[200px] justify-between",
                    !field.value[index].medName && "text-muted-foreground"
                )}>
                    {field.value[index].medName ? field.value[index].medName : "Select medicine"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search medicine..." onValueChange={(value) => { setSearch(value) }} />
                    <CommandEmpty> Not Found </CommandEmpty>
                    <CommandGroup>
                        {medicines.map((medicine) => (
                            <CommandItem
                                value={medicine}
                                key={medicine}
                                onSelect={() => {
                                    form.setValue(fieldName, field.value.map((med: any, i: number) => {
                                        if (i === index) {
                                            return {...med, medName: medicine};
                                        }
                                        return med;
                                    }));
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        medicine === field.value[index].medName
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {medicine}
                            </CommandItem>
                        ))}
                        {search !== '' &&
                            <CommandItem
                                value={search}
                                key={search}
                                onSelect={() => {
                                    form.setValue(fieldName, field.value.map((med: any, i: number) => {
                                        if (i === index) {
                                            return {...med, medName: search};
                                        }
                                        return med;
                                    }));
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        search === field.value[index].medName
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {search !== field.value[index].medName && "Add"} {search}
                            </CommandItem>
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}