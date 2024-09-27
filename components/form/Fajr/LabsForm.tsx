"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TextFormField } from "@/components/ui/TextFormField"
import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import { NumericalFormField } from "../NumericalFormField"
import { TextAreaFormField } from "../../ui/TextAreaFormField"
import { MedicationSelection } from "../MedicationSelection"
import { DatePickerFormField } from "../DatePickerFormField"
import { SelectFormField } from "../SelectFormField"
import { TableSelect } from "../TableSelectTemplate"
import { MedicationPopover } from "../MedicationPopover"
import { PMHxSelect } from "../PMHxSelection"
import { PSHxSelect } from "../PSHxSelection"

const prePostObject = z.object({
    preOp: z.string(),
    postOp: z.string(),
});

const labFormSchema = z.object({
    temp: prePostObject,
    bloodPressure: prePostObject,
    hbA1c: prePostObject,
    albumin: prePostObject,
    sProtein: prePostObject,
    crp: prePostObject,
    esr: prePostObject,
    hgbHct: prePostObject,
    wbc: prePostObject,
    platelets: prePostObject,
    pt: prePostObject,
    ptt: prePostObject,
    inr: prePostObject,
    alkPhos: prePostObject,
    ast: prePostObject,
    alt: prePostObject,
    typeAndScreen: prePostObject,
    covidTest: prePostObject,
    urinalysis: prePostObject,
});

type LabFormValues = z.infer<typeof labFormSchema>
// defaults are all empty strings
const defaultValues: Partial<LabFormValues> = {
    temp: { preOp: "", postOp: "" },
    bloodPressure: { preOp: "", postOp: "" },
    hbA1c: { preOp: "", postOp: "" },
    albumin: { preOp: "", postOp: "" },
    sProtein: { preOp: "", postOp: "" },
    crp: { preOp: "", postOp: "" },
    esr: { preOp: "", postOp: "" },
    hgbHct: { preOp: "", postOp: "" },
    wbc: { preOp: "", postOp: "" },
    platelets: { preOp: "", postOp: "" },
    pt: { preOp: "", postOp: "" },
    ptt: { preOp: "", postOp: "" },
    inr: { preOp: "", postOp: "" },
    alkPhos: { preOp: "", postOp: "" },
    ast: { preOp: "", postOp: "" },
    alt: { preOp: "", postOp: "" },
    typeAndScreen: { preOp: "", postOp: "" },
    covidTest: { preOp: "", postOp: "" },
    urinalysis: { preOp: "", postOp: "" },
};


// since we have 2 values for each field, we need to create a form field wrapper which creates 2 of the same field
// for preOp and postOp. This function will take the form fields as well as the component to render twice
function PrePostFieldWrapper({ form, fieldName, fieldLabel, Component }: { form: any, fieldName: string, fieldLabel: string, Component: any }) {
    return (
        <div className="flex">
            <div className="w-1/2 pr-2">
                <Component form={form} fieldName={`${fieldName}.preOp`} fieldLabel={fieldLabel} />
            </div>
            <div className="w-1/2 pl-2">
                <Component form={form} fieldName={`${fieldName}.postOp`} fieldLabel={fieldLabel} />
            </div>
        </div>
    );
}


export function LabForm() {

    const form = useForm<LabFormValues>({
        resolver: zodResolver(labFormSchema),
        defaultValues,
    });

    function onSubmit(data: LabFormValues) {
        // show a popup with the values
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex">
                        <div className="w-1/2 pr-2">Pre-Op</div>
                        <div className="w-1/2 pl-2">Post-Op</div>
                    </div>
                    <PrePostFieldWrapper form={form} fieldName="temp" fieldLabel="Temperature" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="bloodPressure" fieldLabel="Blood Pressure" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="hbA1c" fieldLabel="HbA1c" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="albumin" fieldLabel="Albumin" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="sProtein" fieldLabel="S Protein" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="crp" fieldLabel="CRP" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="esr" fieldLabel="ESR" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="hgbHct" fieldLabel="Hgb/Hct" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="wbc" fieldLabel="WBC" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="platelets" fieldLabel="Platelets" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="pt" fieldLabel="PT" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="ptt" fieldLabel="PTT" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="inr" fieldLabel="INR" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="alkPhos" fieldLabel="Alk Phos" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="ast" fieldLabel="AST" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="alt" fieldLabel="ALT" Component={NumericalFormField} />
                    <PrePostFieldWrapper form={form} fieldName="typeAndScreen" fieldLabel="Type and Screen" Component={TextFormField} />
                    <PrePostFieldWrapper form={form} fieldName="covidTest" fieldLabel="Covid Test" Component={TextFormField} />
                    <PrePostFieldWrapper form={form} fieldName="urinalysis" fieldLabel="Urinalysis" Component={TextFormField} />

                    {/* <TextFormField form={form} fieldName="patientName" fieldLabel="Patient Full Name" /> */}
                    {/* <NumericalFormField form={form} fieldName="age" fieldLabel="Patient Age" />
                    <TextAreaFormField form={form} fieldName="diagnosis" fieldLabel="Patient Diagnosis" />
                    <TextAreaFormField form={form} fieldName="icd10" fieldLabel="ICD-10" />
                    <DatePickerFormField form={form} fieldName="surgeryDate" fieldLabel="Date of Surgery" />
                    <TextFormField form={form} fieldName="occupation" fieldLabel="Job/Occupation" />
                    <SelectFormField form={form} fieldName="baselineAmbu" fieldLabel="Baseline Ambu" />
                    <MedicationSelection form={form} fieldName="medx" fieldLabel="Medications Needed" />
                    <PMHxSelect form={form} fieldName="pmhx" fieldLabel="PMHx" fieldCompact="PMHx" PopOverComponent={null} />
                    <NumericalFormField form={form} fieldName="smokeCount" fieldLabel="Smoking Status (packs per day)" />
                    <NumericalFormField form={form} fieldName="drinkCount" fieldLabel="Avg Drinks per week" />
                    <TextFormField form={form} fieldName="otherDrugs" fieldLabel="Other illicit uses" />
                    <TextFormField form={form} fieldName="allergies" fieldLabel="Allergies" />
                    <TextAreaFormField form={form} fieldName="notes" fieldLabel="Notes" /> */}

                    <Button type="submit">Submit Request</Button>
                </form>
            </Form>
        </>
    );
}