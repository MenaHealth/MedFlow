// components/form/Fajr/PatientForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "@/components/form/TextFormField";
import { z } from "zod";
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { NumericalFormField } from "./NumericalFormField";
import { TextAreaFormField } from './TextAreaFormField';
import { MedicationSelection } from "./MedicationSelection";
import { DatePickerFormField } from "./DatePickerFormField";
import { SelectFormField } from "./SelectFormField";
import { PMHxSelect } from "./PMHxSelection";
import { PSHxSelect } from "./PSHxSelection";
import { PhoneFormField } from "@/components/form/PhoneFormField";

const patientFormSchema = z.object({
    diagnosis: z.string().optional(),
    icd10: z.string().optional(),
    surgeryDate: z.instanceof(Date).optional(),
    occupation: z.string().optional(),
    baselineAmbu: z.enum(["Not Selected", "Independent", "Boot", "Crutches", "Walker", "Non-Ambulatory"]).optional(),
    laterality: z.enum(["Not Selected", "Bilateral", "Left", "Right"]).optional(),
    priority: z.enum(["Not Selected", "Routine", "Moderate", "Urgent", "Emergency"]).optional(),
    hospital: z.enum(["Not Selected", "PMC", "PRCS", "Hugo Chavez"]).optional(),
    medx: z.array(
        z.object({
            medName: z.string().optional(),
            medDosage: z.string().optional(),
            medFrequency: z.string().optional(),
        })
    ).optional(),
    pmhx: z.array(z.string()).optional(),
    pshx: z.array(z.string()).optional(),
    smokeCount: z.string().optional(),
    drinkCount: z.string().optional(),
    otherDrugs: z.string().optional(),
    allergies: z.string().optional(),
    notes: z.string().optional(),
    files: z.any().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema> & {
    firstName?: string;
    lastName?: string;
    language?: string;
    location?: string;
    age?: number;
    phone?: string;
    chiefComplaint?: string;
    gender?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    familyMedHx: string;
    currentPrescriptions: string;
};

const defaultValues: Partial<PatientFormValues> = {
    diagnosis: "",
    icd10: "",
    surgeryDate: undefined,
    occupation: "",
    laterality: "Not Selected",
    priority: "Not Selected",
    hospital: undefined,
    baselineAmbu: "Not Selected",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: "",
    drinkCount: "",
    otherDrugs: "",
    allergies: "",
    notes: "",
};

export function PatientForm({ id }: { id: string } = { id: "" }) {
    const [patientData, setPatientData] = React.useState<Partial<PatientFormValues>>(defaultValues);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (id !== "") {
            fetch(`/api/patient/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    data.surgeryDate = data.surgeryDate ? new Date(data.surgeryDate) : undefined;
                    data.age = parseInt(data.age) || undefined;
                    setPatientData(data);
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                });
        }
    }, [id]);

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: patientData,
    });

    React.useEffect(() => {
        form.reset(patientData);
    }, [patientData, form]);

    const toggleEditMode = () => {
        if (isEditing) {
            // Save the data
            const updatedData = form.getValues();
            const patientId = id;

            // Send the updated data to your backend using PATCH request
            fetch(`/api/patient/${patientId}`, {
                method: "PATCH",
                body: JSON.stringify(updatedData),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.ok) {
                    console.log("Patient updated successfully");
                    setPatientData(updatedData);
                } else {
                    console.error("Error updating patient:", response.statusText);
                    alert("Error: " + response.statusText);
                }
            }).catch((error) => {
                console.error("Network error:", error);
                alert("An error occurred. Please try again.");
            });
        }
        setIsEditing(!isEditing);
    };

    return (
        <FormProvider {...form}>
            <div className="flex">
                <div className="w-1/4 bg-gray-100 p-4">
                    <h2 className="text-xl font-semibold">Patient Profile</h2>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-orange-500">Demographics</a></li>
                        <li><a href="#">History</a></li>
                        <li><a href="#">Prescriptions</a></li>
                    </ul>
                </div>
                <div className="w-3/4 p-6">
                    <div className="flex justify-between mb-6">
                        <h1 className="text-2xl font-semibold">
                            Patient Information
                        </h1>
                        <Button onClick={toggleEditMode}>
                            {isEditing ? "Save Information" : "Edit Information"}
                        </Button>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium">Demographics</h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>Name: {isEditing ? (
                                    <>
                                        <TextFormField form={form} fieldName="firstName" fieldLabel="First Name" />{" "}
                                        <TextFormField form={form} fieldName="lastName" fieldLabel="Last Name" />
                                    </>
                                ) : (
                                    `${patientData.firstName || ''} ${patientData.lastName || ''}`
                                )}</div>
                                <div>Gender: {isEditing ? (
                                    <TextFormField form={form} fieldName="gender" fieldLabel="Gender" />
                                ) : (
                                    patientData.gender || ''
                                )}</div>
                                <div>Age: {isEditing ? (
                                    <TextFormField form={form} fieldName="age" fieldLabel="Age" />
                                ) : (
                                    patientData.age || ''
                                )}</div>
                                <div>Address: {isEditing ? (
                                    <TextFormField form={form} fieldName="address" fieldLabel="Address" />
                                ) : (
                                    patientData.address || ''
                                )}</div>
                                <div>City: {isEditing ? (
                                    <TextFormField form={form} fieldName="city" fieldLabel="City" />
                                ) : (
                                    patientData.city || ''
                                )}</div>
                                <div>Zip Code: {isEditing ? (
                                    <TextFormField form={form} fieldName="zipCode" fieldLabel="Zip Code" />
                                ) : (
                                    patientData.zipCode || ''
                                )}</div>
                                <div>Language: {isEditing ? (
                                    <TextFormField form={form} fieldName="language" fieldLabel="Language" />
                                ) : (
                                    patientData.language || ''
                                )}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Patient History</h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>Job/Occupation: {isEditing ? (
                                    <TextFormField form={form} fieldName="occupation" fieldLabel="Occupation" />
                                ) : (
                                    patientData.occupation || ''
                                )}</div>
                                <div>Date of Surgery: {isEditing ? (
                                    <TextFormField form={form} fieldName="surgeryDate" fieldLabel="Date of Surgery" />
                                ) : (
                                    patientData.surgeryDate ? patientData.surgeryDate.toDateString() : ''
                                )}</div>
                                <div>Allergies: {isEditing ? (
                                    <TextFormField form={form} fieldName="allergies" fieldLabel="Allergies" />
                                ) : (
                                    patientData.allergies || ''
                                )}</div>
                                <div>Smoking Status: {isEditing ? (
                                    <TextFormField form={form} fieldName="smokeCount" fieldLabel="Smoking Status" />
                                ) : (
                                    patientData.smokeCount || ''
                                )}</div>
                                <div>Alcohol: {isEditing ? (
                                    <TextFormField form={form} fieldName="drinkCount" fieldLabel="Alcohol Consumption" />
                                ) : (
                                    patientData.drinkCount || ''
                                )}</div>
                                <div>Other Illicit Use: {isEditing ? (
                                    <TextFormField form={form} fieldName="otherDrugs" fieldLabel="Other Illicit Use" />
                                ) : (
                                    patientData.otherDrugs || ''
                                )}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Prescription</h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>Past Medical Hx: {isEditing ? (
                                    <TextFormField form={form} fieldName="pmhx" fieldLabel="Past Medical History" />
                                ) : (
                                    patientData.pmhx?.join(', ') || ''
                                )}</div>
                                <div>Family Med Hx: {isEditing ? (
                                    <TextFormField form={form} fieldName="familyMedHx" fieldLabel="Family Medical History" />
                                ) : (
                                    patientData.familyMedHx || ''
                                )}</div>
                                <div>Current Prescriptions: {isEditing ? (
                                    <TextFormField form={form} fieldName="currentPrescriptions" fieldLabel="Current Prescriptions" />
                                ) : (
                                    patientData.currentPrescriptions || ''
                                )}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}

export default PatientForm;
