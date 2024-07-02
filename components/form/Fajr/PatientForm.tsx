"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/form/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Form,
} from "@/components/ui/form"
import { NumericalFormField } from "../NumericalFormField"
import { TextAreaFormField } from "../TextAreaFormField"
import { MedicationSelection } from "../MedicationSelection"
import { DatePickerFormField, DatePopover } from "../DatePickerFormField"
import { SelectFormField } from "../SelectFormField"
import { TableSelect } from "../TableSelectTemplate"
import { MedicationPopover } from "../MedicationPopover"
import { PMHxSelect } from "../PMHxSelection"
import { PSHxSelect } from "../PSHxSelection"
import { cn } from "@/lib/utils"
import { IPatient } from "@/models/patient"
import { ImagesUpload } from "../ImagesUpload"

// https://www.behindthename.com/random/random.php?gender=both&number=2&sets=1&surname=&usage_ara=1
const patientFormSchema = z.object({
    patientId: z.string(),
    age: z.number(),
    diagnosis: z.string(),
    icd10: z.string(),
    surgeryDate: z.instanceof(Date),
    occupation: z.string(),
    baselineAmbu: z.enum(['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']),
    laterality: z.enum(['Bilateral', 'Left', 'Right']),
    priority: z.enum(['Low', 'Medium', 'High']),
    hospital: z.enum(['PMC', 'PRCS', 'Hugo Chavez']),
    medx: z.array(z.object({
        medName: z.string(),
        medDosage: z.string(),
        medFrequency: z.string(),
    })),
    pmhx: z.array(z.string()),
    pshx: z.array(z.string()),
    smokeCount: z.string(),
    drinkCount: z.string(),
    otherDrugs: z.string(),
    allergies: z.string(),
    images: z.any(),
    notes: z.string(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>
const defaultValues: Partial<PatientFormValues> = {
    patientId: "",
    age: 0,
    diagnosis: "",
    icd10: "",
    surgeryDate: new Date(),
    occupation: "",
    laterality: "Bilateral",
    priority: "Low",
    hospital: "PMC",
    baselineAmbu: "Independent",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: "",
    drinkCount: "",
    otherDrugs: "",
    allergies: "",
    images: [],
    notes: "",
}
export function PatientForm({id}: {id: string} = {id: ''}) {

    // set state form values
    const [patientData, setPatientData] = React.useState<Partial<PatientFormValues>>(defaultValues);

    // update default values if id is not empty
    React.useEffect(() => {
    if (id !== '') {
        // fetch the patient-info data from the API
        fetch(`/api/patient/${id}`)
        .then(response => response.json())
        .then(data => {
            // update the form with the data
            data.surgeryDate = new Date(data.surgeryDate);
            data.medx = data.medx.map((med: any) => {
                return {
                    medName: med.medName,
                    medDosage: med.medDosage,
                    medFrequency: med.medFrequency,
                };
            });
            // age
            data.age = parseInt(data.age);
            setPatientData(data);
        })
        .catch(error => {
            // show an alert with the error message
            alert('Error: ' + error.message);
        });
    }}, [id]);


    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    });

    // reset the form values if the patientData changes
    React.useEffect(() => {
        form.reset(patientData);
        // console.log(JSON.stringify(patientData, null, 2));
    }, [patientData, form]);
    
    function onSubmit(data: PatientFormValues) {
        console.log(data.images);
        // update the Patient object using the API

        // send a POST request to the /patient-info/new endpoint with the data
        // import the IPatient interface from the models/patient-info.ts file


        // send the request
        // fetch('/api/patient-info/new', {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        //     headers: {
        //     'Content-Type': 'application/json',
        //     },
        // })
        // .then(response => {
        //     if (response.ok) {
        //     // redirect the user to the dashboard
        //     window.location.href = '/patient-info/dashboard';
        //     } else {
        //     // show an alert with the error message
        //     alert('Error: ' + response.statusText);
        //     }
        // })
        // .catch(error => {
        //     // show an alert with the error message
        //     alert('Error: ' + error.message);
        // });


        // show a popup with the values
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex space-x-4">
                        <div className="w-2/3">
                            <TextFormField form={form} fieldName="patientId" fieldLabel="Patient ID" />
                        </div>
                        <div className="w-1/3">
                            <NumericalFormField form={form} fieldName="age" fieldLabel="Patient Age" />
                        </div>
                    </div>
                    <TextFormField form={form} fieldName="occupation" fieldLabel="Job/Occupation" />
                    <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                    <TextAreaFormField form={form} fieldName="icd10" fieldLabel="ICD-10" />
                            <DatePickerFormField form={form} fieldName="surgeryDate" fieldLabel="Date of Surgery" />
                    <div className="flex space-x-4">
                        <div className="w-1/2 space-y-3">
                            <SelectFormField form={form} fieldName="laterality" fieldLabel="Laterality" selectOptions={['Bilateral', 'Left', 'Right']} />
                            <SelectFormField form={form} fieldName="priority" fieldLabel="Priority" selectOptions={['Low', 'Medium', 'High']} />
                        </div>
                        <div className="w-1/2 space-y-3">
                            <SelectFormField form={form} fieldName="baselineAmbu" fieldLabel="Baseline Ambu" selectOptions={['Independent', 'Boot', 'Crutches', 'Walker', 'Non-Ambulatory']} />
                            <SelectFormField form={form} fieldName="hospital" fieldLabel="Hospital" selectOptions={['PMC', 'PRCS', 'Hugo Chavez']} />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            
                        </div>
                        <div className="w-1/2">
                        </div>
                    </div>


                    <MedicationSelection form={form} fieldName="medx" fieldLabel="Medications Needed" />
                    <PMHxSelect form={form} fieldName="pmhx" fieldLabel="PMHx" fieldCompact="PMHx" PopOverComponent={null} />
                    <PSHxSelect form={form} fieldName="pshx" fieldLabel="PSHx" fieldCompact="PSHx" PopOverComponent={null} />
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <TextFormField form={form} fieldName="smokeCount" fieldLabel="Smoking Status (packs per day)" />
                        </div>
                        <div className="w-1/2">
                            <TextFormField form={form} fieldName="drinkCount" fieldLabel="Avg Drinks per week" />
                        </div>
                    </div>
                    <TextFormField form={form} fieldName="otherDrugs" fieldLabel="Other illicit uses" />
                    <TextFormField form={form} fieldName="allergies" fieldLabel="Allergies" />
                    
                    <ImagesUpload form={form} fieldName='images' fieldLabel='Images'/>
                    
                    <TextAreaFormField form={form} fieldName="notes" fieldLabel="Notes" />

                    <Button type="submit">Submit Request</Button>
                </form>
            </Form>
        </>
    );
}