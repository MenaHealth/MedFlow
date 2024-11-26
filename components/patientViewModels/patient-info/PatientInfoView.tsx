// components/patientViewModels/patient-info/PatientInfoView.tsx
import { useEffect, useState, useMemo, useRef } from 'react';
import { Card, CardContent } from "./../../../components/ui/card";
import ReadOnlyField from './../../../components/form/ReadOnlyField';
import { usePatientDashboard } from '@/components/patientViewModels/PatientViewModelContext';
import { Button } from '@/components/ui/button';
import { TextFormField } from '@/components/form/TextFormField';
import { SelectFormField } from '@/components/form/SelectFormField';
import { DatePickerFormField } from '@/components/form/DatePickerFormField';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneFormField } from '@/components/form/PhoneFormField';
import { CountriesList } from '@/data/countries.enum';
import { LanguagesList } from '@/data/languages.enum';
import { format } from 'date-fns';
import { PatientInfo } from './../PatientViewModelContext'

const patientFormSchema = z.object({
    patientName: z.string(),
    patientID: z.string(),
    language: z.string().optional(),
    dob: z.date(),
    bmi: z.string().optional(),
    country: z.string().optional(),
    city: z.string().default(''),
    phone: z.object({
        countryCode: z.string(),
        phoneNumber: z.string(),
        telegramChatId: z.string().optional(), 
    }),
    email: z.string().optional(),
    occupation: z.string().optional(),
    pmhx: z.string().optional(),
    pshx: z.string().optional(),
    famhx: z.string().optional(),
    drinkCount: z.string().optional(),
    smokeCount: z.string().optional(),
    otherDrugs: z.string().optional(),
    currentMeds: z.string().optional(),
    prevMeds: z.string().optional(),
    gender: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema> & {
    patientName: string;
    patientID: string;
    language?: string;
    dob: Date;
    bmi?: string;
    country?: string;
    city?: string;
    phone: {
        countryCode: string;
        phoneNumber: string;
    };
    email?: string;
    occupation?: string;
    pmhx?: string;
    pshx?: string;
    famhx?: string;
    drinkCount?: string;
    smokeCount?: string;
    otherDrugs?: string;
    currentMeds?: string;
    prevMeds?: string;
    gender?: string,
};

const PatientInfoView: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
    const { patientViewModel, loadingPatientInfo, setPatientInfo } = usePatientDashboard();
    const [isEditing, setIsEditing] = useState(false);

    const expandedDetails = patientViewModel?.getExpandedDetails();
    const defaultValues = useMemo(() => {
        return expandedDetails
            ? {
                ...expandedDetails,
                dob: expandedDetails.dob ? new Date(expandedDetails.dob) : undefined,
            }
            : {};
    }, [expandedDetails]);

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (!patientViewModel) {
            // Call fetch function here if patientViewModel is not loaded
        }
    }, [patientViewModel]);


    const toggleEditMode = () => {
        if (isEditing) {
            const data = form.getValues();

            const patientData = {
                ...data,
                city: data.city || '', // Ensure city is always a string
                country: data.country || '', // Ensure country is always a string
                gender: data.gender || 'Not specified', // Provide a default value for gender
            };

            // Send the updated data to your backend using PATCH request
            fetch(`/api/patient/${expandedDetails?.patientID}`, {
                method: "PATCH",
                body: JSON.stringify(patientData),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("Patient updated successfully");
                        setPatientInfo(patientData as PatientInfo); // Type assertion to ensure compatibility
                    } else {
                        console.error("Error updating patient:", response.statusText);
                        alert("Error: " + response.statusText);
                    }
                })
                .catch((error) => {
                    console.error("Network error:", error);
                    alert("An error occurred. Please try again.");
                });
        }
        setIsEditing(!isEditing);
    };

    const hasResetRef = useRef(false);

    useEffect(() => {
        if (expandedDetails && !form.formState.isDirty && !hasResetRef.current) {
            form.reset(expandedDetails as unknown as PatientFormValues);
            hasResetRef.current = true;
        }
    }, [expandedDetails]);

    if (loadingPatientInfo || !patientViewModel) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="p-4 bg-orange-50">
            {isExpanded && (
                <CardContent className="space-y-2 bg-orange-50">
                    <div className="flex justify-between">
                        <h1 className='text-2xl font-bold p-2 mt-2'>Demographics</h1>
                        <Button className='mt-3' onClick={toggleEditMode}>
                            {isEditing ? "Save Information" : "Edit Information"}
                        </Button>
                    </div>
                    <FormProvider {...form}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <DatePickerFormField name="dob" label="Date of Birth" type='past'/>
                                :<ReadOnlyField
                                    fieldName="dob"
                                    fieldLabel="Date of Birth"
                                    value={expandedDetails?.dob ? format(new Date(expandedDetails.dob), 'PPP') : 'N/A'}
                                />
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName="bmi" fieldLabel="BMI" defaultValue={expandedDetails?.bmi || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="bmi" fieldLabel="BMI" value={expandedDetails?.bmi || 'N/A'}/>
                            }
                            {isEditing
                                ? <PhoneFormField form={form} fieldName="phone" fieldLabel="Phone" defaultValue={expandedDetails?.phone || {countryCode: '', phoneNumber: ''}} classNames='p-2'/>
                                : <ReadOnlyField fieldName="phone" fieldLabel="Phone" value={`${expandedDetails?.phone?.countryCode ?? ''} ${expandedDetails?.phone?.phoneNumber ?? ''}` || 'N/A'}/>
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName="email" fieldLabel="Email" defaultValue={expandedDetails?.email ?? ''} classNames='mt-2 mb-6 p-2'/>
                                : <ReadOnlyField fieldName="email" fieldLabel="Email" value={expandedDetails?.email || 'N/A'}/>
                            }
                            {isEditing
                                ? <SelectFormField form={form} fieldName='language' fieldLabel="Language Spoken" selectOptions={LanguagesList} defaultValue={expandedDetails?.language || ""} classNames='mt-2 mb-6 p-2'/>
                                : <ReadOnlyField fieldName="language" fieldLabel="Language Spoken" value={expandedDetails?.language || 'N/A'}/>
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <SelectFormField form={form} fieldName='country' fieldLabel="Country" selectOptions={CountriesList} defaultValue={expandedDetails?.country || ""} classNames='mt-6 mb-6 p-2'/>
                                : <ReadOnlyField fieldName="country" fieldLabel="Country" value={expandedDetails?.country || 'N/A'}/>
                            }
                            {isEditing
                                ? <TextFormField form={form} fieldName='city' fieldLabel="City" defaultValue={expandedDetails?.city || ''} classNames='mt-6 mb-6 p-2'/>
                                : <ReadOnlyField fieldName="city" fieldLabel="City" value={expandedDetails?.city || ''}/>
                            }
                        </div>
                        <h1 className='text-2xl font-bold p-2 mt-2'>Past History</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName='occupation' fieldLabel="Job/Occupation" defaultValue={expandedDetails?.occupation || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="occupation" fieldLabel="Job/Occupation" value={expandedDetails?.occupation || 'N/A'}/>
                            }
                            {isEditing
                                ? <TextFormField form={form} fieldName='pmhx' fieldLabel="Past Medical Hx" defaultValue={expandedDetails?.pmhx || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="pmhx" fieldLabel="Past Medical Hx" value={expandedDetails?.pmhx || 'N/A'}/>
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName='pshx' fieldLabel="Surgical Hx" defaultValue={expandedDetails?.pshx || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="pshx" fieldLabel="Surgical Hx" value={expandedDetails?.pshx || 'N/A'}/>
                            }
                            {isEditing
                                ? <TextFormField form={form} fieldName='famhx' fieldLabel="Family Hx" defaultValue={expandedDetails?.famhx || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="famhx" fieldLabel="Family Hx" value={expandedDetails?.famhx || 'N/A'}/>
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName='drinkCount' fieldLabel='Alcohol Use' defaultValue={expandedDetails?.drinkCount || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="drinkCount" fieldLabel='Alcohol Use' value={expandedDetails?.drinkCount || 'N/A'}/>
                            }
                            {isEditing
                                ? <TextFormField form={form} fieldName='smokeCount' fieldLabel='Smoking Status' defaultValue={expandedDetails?.smokeCount || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="smokeCount" fieldLabel='Smoking Status' value={expandedDetails?.smokeCount || 'N/A'}/>
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName='otherDrugs' fieldLabel='Drug Use' defaultValue={expandedDetails?.otherDrugs || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="otherDrugs" fieldLabel='Drug Use' value={expandedDetails?.otherDrugs || 'N/A'}/>
                            }
                        </div>
                        <h1 className='text-2xl font-bold p-2 mt-2'>Prescription History</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing
                                ? <TextFormField form={form} fieldName='currentMeds' fieldLabel='Current Medications' defaultValue={expandedDetails?.currentMeds || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="currentMeds" fieldLabel='Current Medications' value={expandedDetails?.currentMeds || 'N/A'}/>
                            }
                            {isEditing
                                ? <TextFormField form={form} fieldName='prevMeds' fieldLabel='Previous Medications' defaultValue={expandedDetails?.prevMeds || ''} classNames='p-2'/>
                                : <ReadOnlyField fieldName="prevMeds" fieldLabel='Previous Medications' value={expandedDetails?.prevMeds || 'N/A'}/>
                            }
                        </div>
                    </FormProvider>
                </CardContent>
            )}

        </Card>
    );
};

export default PatientInfoView;