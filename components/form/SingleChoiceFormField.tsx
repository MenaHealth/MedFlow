import React, { useState, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/form/ScrollArea";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleChoiceFormFieldProps {
    fieldName: string;
    fieldLabel?: string;
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

    const listBoxId = `listbox-${fieldName}`;

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {fieldLabel && <FormLabel>{fieldLabel}</FormLabel>}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <div
                                    className={cn(
                                        "w-full p-2 border rounded-md bg-white text-left flex justify-between items-center", // Added flex, justify-between, items-center for alignment
                                        !displayValue && "text-muted-foreground",
                                        "min-h-[40px]" // sets minimum height
                                    )}
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        wordWrap: "break-word",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                    onClick={() => setOpen(true)}
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-controls={listBoxId}
                                >
                                    <span>{displayValue || `Select ${fieldLabel || 'option'}`}</span>
                                    {/* Added margin to the left and aligned chevrons to the right */}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </div>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" id={listBoxId}>
                            <Command>
                                {choices.length >= 10 && (
                                    <CommandInput
                                        placeholder={`Search ${fieldLabel?.toLowerCase() || 'option'}...`}
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                    />
                                )}
                                <CommandEmpty>No {fieldLabel?.toLowerCase() || 'option'} found.</CommandEmpty>
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