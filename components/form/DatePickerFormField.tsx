// components/form/DatePickerFormField.tsx

"use client"

import * as React from "react"
import { format, startOfYear, endOfYear, eachMonthOfInterval, addYears, subYears } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Send } from "lucide-react";
import { DayPicker } from "react-day-picker"
import { useFormContext } from "react-hook-form"

import { cn } from "../../utils/classNames";
import { Button } from "./../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {useMemo, useState} from "react";


interface CalendarProps {
    className?: string;
    classNames?: any;
    showOutsideDays?: boolean;
    type?: "future" | "past";
    selected?: Date | undefined;
    onSelect?: (date: Date | undefined) => void;
    mode?: "single" | "range" | "multiple";
}

function Calendar({
                      className,
                      classNames,
                      showOutsideDays = true,
                      type = "future",
                      mode = "single",
                      selected,
                      onSelect,
                      ...props
                  }: CalendarProps) {
    const today = useMemo(() => new Date(), []);
    const [year, setYear] = React.useState(selected?.getFullYear() || today.getFullYear());
    const [month, setMonth] = React.useState(selected?.getMonth() || today.getMonth());

    const yearsToShow = 100;

    const years = React.useMemo(() => {
        if (type === "future") {
            return Array.from({ length: yearsToShow }, (_, i) => today.getFullYear() + i);
        } else {
            return Array.from({ length: yearsToShow }, (_, i) => today.getFullYear() - i).reverse();
        }
    }, [type, today]);

    const months = React.useMemo(() => {
        return eachMonthOfInterval({
            start: startOfYear(new Date(year, 0, 1)),
            end: endOfYear(new Date(year, 0, 1)),
        });
    }, [year]);

    // Adjust the month and year when a new date is selected
    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setYear(date.getFullYear());
            setMonth(date.getMonth());
            onSelect?.(date);
        }
    };

    // Update the month without changing the selected date
    const handleMonthChange = (value: string) => {
        setMonth(parseInt(value));
        const newDate = new Date(year, parseInt(value), selected?.getDate() || today.getDate());
        onSelect?.(newDate); // Only update the month visually
    };

    // Update the year without changing the selected date
    const handleYearChange = (value: string) => {
        setYear(parseInt(value));
        const newDate = new Date(parseInt(value), month, selected?.getDate() || today.getDate());
        onSelect?.(newDate); // Only update the year visually
    };



    return (
        <DayPicker
            mode={mode as "single"}
            selected={selected}
            showOutsideDays={showOutsideDays}
            onSelect={handleDateSelect}
            month={new Date(year, month)}
            className={cn("p-3", className || "" )}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                    mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md"
                ),
                day: cn("h-8 w-8 p-0 font-normal aria-selected:opacity-100"),
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                Caption: ({ ...captionProps }) => (
                    <div className="flex justify-center space-x-2">
                        <Select
                            onValueChange={handleMonthChange}
                        >
                            <SelectTrigger className="w-[110px]">
                                <SelectValue placeholder={format(new Date(year, month), "MMMM")} />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        {format(month, "MMMM")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            onValueChange={handleYearChange}
                        >
                            <SelectTrigger className="w-[90px]">
                                <SelectValue placeholder={year.toString()} />
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
                ),
            }}
            disabled={type === "future" ? (date) => date < new Date() : (date) => date > new Date()}
            {...props}
        />
    );
}

interface DatePickerFormFieldProps {
    name: string
    label: string
    type?: "future" | "past"
    classNames?: string
}

export function DatePickerFormField({ name, label, type = "future", classNames }: DatePickerFormFieldProps) {
    const { control, setValue } = useFormContext()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = () => {
        if (selectedDate) {
            setValue(name, selectedDate.toISOString())
            setIsOpen(false)
        }
    }

    return (
        <div className={classNames}>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>{label}</FormLabel>
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value ? "text-muted-foreground" : ""
                                        )}
                                    >
                                        {field.value ? (
                                            format(new Date(field.value), "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="p-3">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        type={type}
                                    />
                                    <div className="mt-4">
                                        <Button className="w-full" onClick={handleSubmit}>
                                            <Send className="mr-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}