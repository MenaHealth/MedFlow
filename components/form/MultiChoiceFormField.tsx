import React, { useState, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/form/ScrollArea";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../utils/classNames";
import { Send } from "lucide-react";

interface MultiChoiceFormFieldProps {
    fieldName: string;
    fieldLabel: string;
    choices: string[];
}

export function MultiChoiceFormField({ fieldName, fieldLabel, choices }: MultiChoiceFormFieldProps) {
    const form = useFormContext();
    const [open, setOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelect = useCallback((currentValue: string) => {
        setSelectedItems((prev) => {
            if (prev.includes(currentValue)) {
                return prev.filter(item => item !== currentValue);
            } else {
                return [...prev, currentValue];
            }
        });
    }, []);

    const handleSubmit = useCallback(() => {
        form.setValue(fieldName, selectedItems);
        setOpen(false);
    }, [fieldName, form, selectedItems]);

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
                                    {displayValue && displayValue.length > 0
                                        ? displayValue.join(", ")
                                        : `Select ${fieldLabel}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                {choices.length >= 7 && (
                                    <CommandInput placeholder={`Search ${fieldLabel.toLowerCase()}...`} />
                                )}
                                <CommandEmpty>No {fieldLabel.toLowerCase()} found.</CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea className="h-72">
                                        {choices.map((choice) => (
                                            <CommandItem
                                                key={choice}
                                                onSelect={() => handleSelect(choice)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedItems.includes(choice) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {choice}
                                            </CommandItem>
                                        ))}
                                    </ScrollArea>
                                </CommandGroup>
                            </Command>
                            <div className="flex items-center justify-center p-2">
                                <Button className="w-full" onClick={handleSubmit}>
                                    <Send className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}