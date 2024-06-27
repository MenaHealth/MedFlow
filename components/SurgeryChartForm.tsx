"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import Patient from "@/models/patient";
import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/form/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"

const patientFormSchema = z.object({
    patientName: z.string(),
    age: z.number(),
    diagnosis: z.string(),
    icd10: z.string(),
    surgeryDate: z.string(),
    occupation: z.string(),
    baselineAmbu: z.string(),
    medx: z.array(z.object({
        medName: z.string(),
        medDosage: z.string(),
        medFrequency: z.string(),
    })),
    pmhx: z.array(z.object({
        pmhxName: z.string()
    })),
    pshx: z.array(z.object({
        pshxDate: z.string()
    })),
    smokeCount: z.number(),
    drinkCount: z.number(),
    otherDrugs: z.string(),
    allergies: z.string(),
    notes: z.string(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>
const defaultValues: Partial<PatientFormValues> = {
    patientName: "",
    age: 0,
    diagnosis: "",
    icd10: "",
    surgeryDate: new Date().toISOString().split("T")[0],
    occupation: "",
    baselineAmbu: "",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: 0,
    drinkCount: 0,
    otherDrugs: "",
    allergies: "",
    notes: "",
}

export default function SurgeryChartForm({ id }: { id: string }) {

    const [patient, setPatient] = useState<null | typeof Patient>(null);

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    });

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await fetch(`/api/patient/${id}`);
            const data = await response.json();

            setPatient(data);
        };

        fetchPatients();
    }, [id]);


    // create a alert function for debugging what the form is submitting
    const alertForm = (data: any) => {
        alert(JSON.stringify(patient, null, 2));
    }

    // const handleSubmit = async () => {
    //     // Perform the patch request to update the patient-info object in the database
    //     // let assignedClinic = 'Cardiology';// ? 'Dermatology' : 'Cardiology';
    //     // console.log('Submitting form: ' + patient-info.assignedClinic);
    //     const response = await fetch('/api/patient-info/', {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             _id: id,
    //             assignedClinic: patient-info.assignedClinic,
    //         }),
    //     });
    //     if (response.ok) {
    //         // Handle successful patch request
    //         console.log('Patient object updated successfully');
    //     } else {
    //         // Handle error in patch request
    //         console.error('Failed to update patient-info object');
    //     }
    // };

    if (!patient) {
        return <div>Loading...</div>;
    }

    // this chart lays out this form. The pre post object is 2 columns
    // const labFormSchema = z.object({
    //     temp: prePostObject,
    //     bloodPressure: prePostObject,
    //     hbA1c: prePostObject,
    //     albumin: prePostObject,
    //     sProtein: prePostObject,
    //     crp: prePostObject,
    //     esr: prePostObject,
    //     hgbHct: prePostObject,
    //     wbc: prePostObject,
    //     platelets: prePostObject,
    //     pt: prePostObject,
    //     ptt: prePostObject,
    //     inr: prePostObject,
    //     alkPhos: prePostObject,
    //     ast: prePostObject,
    //     alt: prePostObject,
    //     typeAndScreen: prePostObject,
    //     covidTest: prePostObject,
    //     urinalysis: prePostObject,
    // });



    return (
        <>
            {patient && (

                // {/*  <Form {...form}>
                //     <form onSubmit={form.handleSubmit(alertForm)} className="space-y-8">
                //         <TextFormField form={form} fieldName="patientName" fieldLabel="Patient Full Name" />
                //         <Button type="submit">Submit Request</Button>
                //     </form> */}
                <form className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex-1 pr-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
                                    PATIENT FULL NAME
                                </label>
                                <Input id="firstName" placeholder="Full Name"/>
                            </div>
                            <div className="flex-1 px-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
                                    SUMMARY
                                </label>
                                <Input id="lastName" placeholder="Summary"/>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b py-4">

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">PRE OP</label>
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="temp">
                                    Temp
                                </label>
                                <Input id="temp" placeholder="Temperature" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">POST OP</label>
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="temp">
                                    Temp
                                </label>
                                <Input id="temp" placeholder="Temperature" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="bloodPressure">
                                    Blood Pressure
                                </label>
                                <Input id="bloodPressure" placeholder="120/80" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="bloodPressure">
                                    Blood Pressure
                                </label>
                                <Input id="bloodPressure" placeholder="120/80" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="hbA1c">
                                    HbA1c
                                </label>
                                <Input id="hbA1c" placeholder="HbA1c" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="hbA1c">
                                    HbA1c
                                </label>
                                <Input id="hbA1c" placeholder="HbA1c" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="albumin">
                                    Albumin
                                </label>
                                <Input id="albumin" placeholder="Albumin" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="albumin">
                                    Albumin
                                </label>
                                <Input id="albumin" placeholder="Albumin" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="sProtein">
                                    S Protein
                                </label>
                                <Input id="sProtein" placeholder="S Protein" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="sProtein">
                                    S Protein
                                </label>
                                <Input id="sProtein" placeholder="S Protein" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="crp">
                                    CRP
                                </label>
                                <Input id="crp" placeholder="CRP" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="crp">
                                    CRP
                                </label>
                                <Input id="crp" placeholder="CRP" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="esr">
                                    ESR
                                </label>
                                <Input id="esr" placeholder="ESR" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="esr">
                                    ESR
                                </label>
                                <Input id="esr" placeholder="ESR" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="hgbHct">
                                    Hgb/Hct
                                </label>
                                <Input id="hgbHct" placeholder="Hgb/Hct" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="hgbHct">
                                    Hgb/Hct
                                </label>
                                <Input id="hgbHct" placeholder="Hgb/Hct" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="wbc">
                                    WBC
                                </label>
                                <Input id="wbc" placeholder="WBC" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="wbc">
                                    WBC
                                </label>
                                <Input id="wbc" placeholder="WBC" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="platelets">
                                    Platelets
                                </label>
                                <Input id="platelets" placeholder="Platelets" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="platelets">
                                    Platelets
                                </label>
                                <Input id="platelets" placeholder="Platelets" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="pt">
                                    PT
                                </label>
                                <Input id="pt" placeholder="PT" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="pt">
                                    PT
                                </label>
                                <Input id="pt" placeholder="PT" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="ptt">
                                    PTT
                                </label>
                                <Input id="ptt" placeholder="PTT" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="ptt">
                                    PTT
                                </label>
                                <Input id="ptt" placeholder="PTT" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="inr">
                                    INR
                                </label>
                                <Input id="inr" placeholder="INR" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="inr">
                                    INR
                                </label>
                                <Input id="inr" placeholder="INR" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="alkPhos">
                                    Alk Phos
                                </label>
                                <Input id="alkPhos" placeholder="Alk Phos" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="alkPhos">
                                    Alk Phos
                                </label>
                                <Input id="alkPhos" placeholder="Alk Phos" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="ast">
                                    AST
                                </label>
                                <Input id="ast" placeholder="AST" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="ast">
                                    AST
                                </label>
                                <Input id="ast" placeholder="AST" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="alt">
                                    ALT
                                </label>
                                <Input id="alt" placeholder="ALT" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="alt">
                                    ALT
                                </label>
                                <Input id="alt" placeholder="ALT" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="typeAndScreen">
                                    Type and Screen
                                </label>
                                <Input id="typeAndScreen" placeholder="Type and Screen" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="typeAndScreen">
                                    Type and Screen
                                </label>
                                <Input id="typeAndScreen" placeholder="Type and Screen" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="covidTest">
                                    Covid Test
                                </label>
                                <Input id="covidTest" placeholder="Covid Test" />
                            </div>
                        </div>
                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="covidTest">
                                    Covid Test
                                </label>
                                <Input id="covidTest" placeholder="Covid Test" />
                            </div>
                        </div>

                        <div className="mb-4">

                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="urinalysis">
                                    Urinalysis
                                </label>
                                <Input id="urinalysis" placeholder="Urinalysis" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="urinalysis">
                                    Urinalysis
                                </label>
                                <Input id="urinalysis" placeholder="Urinalysis" />
                            </div>
                        </div>


                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="file">
                                    File Upload
                                </label>
                                <Input id="file" type="file" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mt-1">
                                <label className="block text-xs font-medium text-gray-700" htmlFor="file">
                                    File Upload
                                </label>
                                <Input id="file" type="file" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-md" >
                            Save
                        </button>
                    </div>
                </form>
                // </Form>

            )}
        </>
    );
}

