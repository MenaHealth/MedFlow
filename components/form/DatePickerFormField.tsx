"use client"

import { useState, useEffect } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format, setYear, setMonth, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export function DatePopover({ field }: { field: any }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
        if (field.value instanceof Date) {
            return field.value
        } else if (typeof field.value === 'string') {
            return parse(field.value, 'yyyy-MM-dd', new Date())
        }
        return undefined
    })

    const [currentMonth, setCurrentMonth] = useState(
        selectedDate ? selectedDate.getMonth() : new Date().getMonth()
    )
    const [currentYear, setCurrentYear] = useState(
        selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
    )

    useEffect(() => {
        if (field.value instanceof Date) {
            setSelectedDate(field.value)
            setCurrentMonth(field.value.getMonth())
            setCurrentYear(field.value.getFullYear())
        } else if (typeof field.value === 'string') {
            const parsedDate = parse(field.value, 'yyyy-MM-dd', new Date())
            setSelectedDate(parsedDate)
            setCurrentMonth(parsedDate.getMonth())
            setCurrentYear(parsedDate.getFullYear())
        }
    }, [field.value])

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
            setCurrentMonth(date.getMonth())
            setCurrentYear(date.getFullYear())
            field.onChange(format(date, 'yyyy-MM-dd'))
        } else {
            field.onChange(null)
        }
    }

    const handleMonthChange = (month: string) => {
        const monthIndex = months.indexOf(month)
        setCurrentMonth(monthIndex)
        if (selectedDate) {
            const newDate = setMonth(selectedDate, monthIndex)
            setSelectedDate(newDate)
            field.onChange(format(newDate, 'yyyy-MM-dd'))
        }
    }

    const handleYearChange = (year: string) => {
        const yearNumber = parseInt(year)
        setCurrentYear(yearNumber)
        if (selectedDate) {
            const newDate = setYear(selectedDate, yearNumber)
            setSelectedDate(newDate)
            field.onChange(format(newDate, 'yyyy-MM-dd'))
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        {selectedDate ? (
                            format(selectedDate, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between p-2">
                    <Select value={months[currentMonth]} onValueChange={handleMonthChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    month={new Date(currentYear, currentMonth)}
                    onMonthChange={(date) => {
                        setCurrentMonth(date.getMonth())
                        setCurrentYear(date.getFullYear())
                    }}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

interface DatePickerFormFieldProps {
    form: any
    fieldName: string
    fieldLabel: string
    autoComplete?: string
}

export function DatePickerFormField({
                                        form,
                                        fieldName,
                                        fieldLabel,
                                        autoComplete
                                    }: DatePickerFormFieldProps) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <DatePopover field={field} />
                    {autoComplete && (
                        <input
                            type="date"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            autoComplete={autoComplete}
                            className="sr-only"
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}