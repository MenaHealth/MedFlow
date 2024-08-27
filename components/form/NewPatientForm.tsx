// components/form/NewPatientForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextFormField } from "@/components/form/TextFormField";
import { NumericalFormField } from "@/components/form/NumericalFormField";
import { TextAreaFormField } from "@/components/form/TextAreaFormField";
import { PhoneFormField } from "@/components/form/PhoneFormField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PuffLoader from "react-spinners/PuffLoader";

const newPatientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(1, "Phone number is required"),
    age: z.number().min(0, "Please enter a number greater than 0"),
    location: z.string().min(1, "Location is required"),
    language: z.string().min(1, "Language is required"),
    chiefComplaint: z.string().min(1, "Please enter the main reason you seek medical care"),
    email: z.string().email(),
});

type NewPatientFormValues = z.infer<typeof newPatientFormSchema>;

type NewPatientFormProps = {
    handleSubmit: (formData: NewPatientFormValues) => void;
    submitting: boolean;
};

export function NewPatientForm({ handleSubmit, submitting }: NewPatientFormProps) {
    const form = useForm<NewPatientFormValues>({
        resolver: zodResolver(newPatientFormSchema),
        defaultValues: {
            firstName: '',
            email: '',
            lastName: '',
            phone: '',
            age: 0,
            location: '',
            language: '',
            chiefComplaint: '',
        },
    });

    const [loading, setLoading] = React.useState(false);

    const getLocation = () => {
        setLoading(true); // Start loading
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch('/api/patient/location', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ latitude, longitude }),
                    });

                    const data = await response.json();

                    if (data.location) {
                        form.setValue("location", data.location);
                    } else {
                        alert("Location not found");
                    }
                } catch (error) {
                    console.error("Failed to fetch location data:", error);
                    alert("Failed to fetch location data");
                } finally {
                    setLoading(false);
                }
            }, () => {
                setLoading(false); // Stop loading on error
                alert("Failed to retrieve your location");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            setLoading(false); // Stop loading if geolocation is not supported
        }
    };

    const onSubmit = (data: NewPatientFormValues) => {
        console.log("Submitting data:", data);
        handleSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                    </div>
                </div>
                <TextFormField form={form} fieldName="email" fieldLabel="Email" />
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/4">
                        <NumericalFormField form={form} fieldName="age" fieldLabel="Age" />
                    </div>
                    <div className="w-full md:w-3/8">
                        <PhoneFormField form={form} fieldName="phone" fieldLabel="Phone Number" />
                    </div>
                    <div className="w-full md:w-3/8">
                        <TextFormField form={form} fieldName="language" fieldLabel="Language" />
                    </div>
                </div>

                <div className="flex w-full space-x-2">
                    <div className="flex-grow">
                        <TextFormField form={form} fieldName="location" fieldLabel="Location" className="w-full" />
                    </div>
                    <div className="flex items-end">
                        {loading ? (
                            <PuffLoader size={30} color="#FF5722" />
                        ) : (
                            <button
                                type="button"
                                onClick={getLocation}
                                className="text-white bg-black hover:bg-gray-700 focus:outline-none p-2 rounded h-10 w-10 flex items-center justify-center"
                            >
                                <MyLocationIcon style={{ fontSize: '1.5rem' }} />
                            </button>
                        )}
                    </div>
                </div>

                <TextAreaFormField form={form} fieldName="chiefComplaint" fieldLabel="Chief Complaint" />
                <div className="flex justify-center">
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit New Patient"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default NewPatientForm;