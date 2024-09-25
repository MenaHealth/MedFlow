import React, { useState, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/form/ScrollArea";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleChoiceFormFieldProps {
    fieldName: string;
    fieldLabel: string;
    choices: string[];
}

export function SingleChoiceFormField({
                                          fieldName,
                                          fieldLabel,
                                          choices,
                                      }: SingleChoiceFormFieldProps) {
    const form = useFormContext();
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredChoices = choices.filter((choice) =>
        choice.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = useCallback((selectedChoice: string) => {
        form.setValue(fieldName, selectedChoice);
        setOpen(false);
    }, [form, fieldName]);

    const displayValue = form.watch(fieldName);

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-full justify-between",
                                        !displayValue && "text-muted-foreground"
                                    )}
                                >
                                    {displayValue || `Select ${fieldLabel}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                {choices.length >= 7 && (
                                    <CommandInput
                                        placeholder={`Search ${fieldLabel.toLowerCase()}...`}
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                    />
                                )}
                                <CommandEmpty>No {fieldLabel.toLowerCase()} found.</CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea className="h-72">
                                        {filteredChoices.map((choice) => (
                                            <CommandItem
                                                key={choice}
                                                onSelect={() => handleSelect(choice)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === choice ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {choice}
                                            </CommandItem>
                                        ))}
                                    </ScrollArea>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}