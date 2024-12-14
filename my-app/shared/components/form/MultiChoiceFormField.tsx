"use client"

import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import {
    MultiSelector,
    MultiSelectorTrigger,
    MultiSelectorInput,
    MultiSelectorContent,
    MultiSelectorList,
    MultiSelectorItem,
} from "./MultiSelector"
import { ScrollArea } from "./../ui/ScrollArea"

interface MultiChoiceFormFieldProps {
    fieldName: string
    fieldLabel: string
    choices: string[]
}

export function MultiChoiceFormField({ fieldName, fieldLabel, choices }: MultiChoiceFormFieldProps) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                        <MultiSelector
                            values={field.value || []}
                            onValuesChange={(newValues) => {
                                field.onChange(newValues)
                                form.trigger(fieldName)
                            }}
                        >
                            <MultiSelectorTrigger className="w-full">
                                <MultiSelectorInput
                                    placeholder={`Select ${fieldLabel}`}
                                    className={cn(
                                        "w-full text-left justify-between",
                                        field.value && field.value.length > 0 ? "" : "text-muted-foreground"
                                    )}
                                />
                            </MultiSelectorTrigger>
                            <MultiSelectorContent className="w-full sm:w-[350px] md:w-[450px]">
                                <ScrollArea className="h-[200px] w-full rounded-md border">
                                    <MultiSelectorList>
                                        {choices.map((choice, index) => (
                                            <MultiSelectorItem key={index} value={choice}>
                                                {choice}
                                            </MultiSelectorItem>
                                        ))}
                                    </MultiSelectorList>
                                </ScrollArea>
                            </MultiSelectorContent>
                        </MultiSelector>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}