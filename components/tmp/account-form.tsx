"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as React from "react"
import { cn } from "../../utils/classNames";
import { Button } from "./../ui/button";
import { Calendar } from "./../ui/calendar"
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "../ui/textarea"

const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
] as const

const medicalSpecialties: string[] = [
    "Dentistry",
    "Emergency Medicine",
    "Family Medicine",
    "General Surgery",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Neurosurgery",
    "OB-GYN",
    "Ophthalmology",
    "Orthopedics-Traumatology",
    "Pediatrics",
    "Psychiatry",
    "Rheumatology",
] as const;

const patientLocations: string[] = [
    'North Gaza',
    'Gaza City',
    'Deir Al Balah',
    'Khan Yunis',
    'Rafah'
] as const;

const medicines: string[] = [
    "med A",
    "med B",
    "med C",
] as const;
  

const accountFormSchema = z.object({
    name: z
        .string(),
    patientName: z
        .string(),
    patientPhone: z
        .string(),
    medicines: z.string(),
    // specialty: z.string(),
    patientDiagnosis: z.string(),
    dob: z.date(),
    language: z.string(),
    type: z.enum(["all", "mentions", "none"]),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
    // name: "Your name",
    // dob: new Date("2023-01-23"),
}

export function AccountForm() {
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    })

    function onSubmit(data: AccountFormValues) {
        console.log(data)
    }

    const [search, setSearch] = React.useState('');
    const [selectedMedicines, setSelectedMedicines] = React.useState(["a"]);

    return (<>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dr(s) In Charge Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Specialty Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {
                                        if (value !== "custom") {
                                            field.onChange(value);
                                        }
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        {medicalSpecialties.map((specialty) => (
                                            <div className="flex items-center space-x-2" key={specialty}>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={specialty} id={specialty} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {specialty}
                                                    </FormLabel>
                                                </FormItem>
                                            </div>
                                        ))}
                                        <div className="flex items-center space-x-2">
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="customSpecialty" id="customSpecialty" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Custom:
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your specialty"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        document.getElementById("customSpecialty")?.click();
                                                    }}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />                
                <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient full name</FormLabel>
                            <FormControl>
                                <Input placeholder="Patient's full name" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="patientPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Patient's phone" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Patient Address</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        {patientLocations.map((location) => (
                                            <div className="flex items-center space-x-2" key={location}>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={location} id={location} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {location}
                                                    </FormLabel>
                                                </FormItem>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="patientDiagnosis"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient Diagnosis</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Patient diagnosis" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Your date of birth is used to calculate your age.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="medicines"
                    render={({ field }) => (
                        <div className="flex flex-col gap-4">
                            {selectedMedicines.map((medicine, index) => (
                                // <div key={medicine}>
                                <div className="flex items-center space-x-3" key={index}>
                                    <FormItem className="flex items-center">
                                        <FormLabel className="px-4">Medicine {index + 1}</FormLabel>
                                        <Popover><PopoverTrigger asChild>
                                            <FormControl >
                                                <Button variant="outline" role="combobox" className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                )}>
                                                    {field.value? field.value: "Select medicine"}
                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search medicine..." onValueChange={(value) => { setSearch(value)}} />
                                                <CommandEmpty> Not Found </CommandEmpty>
                                                <CommandGroup>
                                                    {medicines.map((medicine) => (
                                                        <CommandItem
                                                            value={medicine}
                                                            key={medicine}
                                                            onSelect={() => {
                                                                form.setValue("medicines", field.value)
                                                            }}
                                                        >
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    medicine === field.value
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
                                                                form.setValue("medicines", field.value)
                                                            }}
                                                        >
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    search === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {search}
                                                        </CommandItem>
                                                    }
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent></Popover>
                                        <FormDescription className="px-2">
                                        </FormDescription>
                                        <Input className="flex-1"/>
                                        <FormMessage className="px-2"/>
                                        <Input className="flex-1"/>
                                    </FormItem>
                                </div>
                            ))}
                            <Button type="button" onClick={() => setSelectedMedicines([...selectedMedicines, selectedMedicines.length.toString()])}>Add Medicine</Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Language</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? languages.find(
                                                    (language) => language.value === field.value
                                                )?.label
                                                : "Select language"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search language..." />
                                        <CommandEmpty>No language found.</CommandEmpty>
                                        <CommandGroup>
                                            {languages.map((language) => (
                                                <CommandItem
                                                    value={language.label}
                                                    key={language.value}
                                                    onSelect={() => {
                                                        form.setValue("language", language.value)
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            language.value === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {language.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                This is the language that will be used in the dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Update account</Button>
            </form>
        </Form></>
    )
}