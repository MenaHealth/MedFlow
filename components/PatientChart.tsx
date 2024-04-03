"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import Patient from "@/models/patient";

export default function PatientChart({ id }: { id: string }) {

    const [patient, setPatient] = useState<null | typeof Patient>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await fetch(`/api/patient/${id}`);
            const data = await response.json();

            setPatient(data);
        };

        fetchPatients();
    }, [id]);

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {patient && (
                <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex-1 pr-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
                                    PATIENT FIRST NAME
                                </label>
                                <Input id="firstName" placeholder="First Name" value={patient.name} />
                            </div>
                            <div className="flex-1 px-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
                                    LAST NAME
                                </label>
                                <Input id="lastName" placeholder="Last Name" />
                            </div>
                            <div className="flex-1 pl-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                                    Date
                                </label>
                                <Input id="date" placeholder="__/__/____" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b py-4">
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">VITALS</label>
                                <div className="mt-1">
                                    <label className="block text-xs font-medium text-gray-700" htmlFor="bp">
                                        BP
                                    </label>
                                    <Input id="bp" placeholder="120/80" />
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-1">
                                    <Input placeholder="Height" />
                                    <Input placeholder="Weight" />
                                    <Input placeholder="BMI" />
                                    <Input placeholder="O2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="historyPresentIllness">
                                    HISTORY OF PRESENT ILLNESS
                                </label>
                                <Textarea id="historyPresentIllness" placeholder="Describe the present illness..." />
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">GENDER</label>
                                <Select>
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="dob">
                                    DOB
                                </label>
                                <Input id="dob" placeholder="__/__/____" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="physicalExam">
                                    PHYSICAL EXAM
                                </label>
                                <Textarea id="physicalExam" placeholder="Enter physical exam details..." />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="pastMedicalHistory">
                                PAST MEDICAL HISTORY
                            </label>
                            <Textarea id="pastMedicalHistory" placeholder="List any past medical history..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="diagnosis">
                                DIAGNOSIS
                            </label>
                            <Textarea id="diagnosis" placeholder="Enter diagnosis..." />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="allergiesMedicationHistory">
                                ALLERGIES/MEDICATION HISTORY
                            </label>
                            <Textarea id="allergiesMedicationHistory" placeholder="List any allergies or medication history..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="plan">
                                PLAN
                            </label>
                            <Textarea id="plan" placeholder="Outline the plan for treatment..." />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="familyHistory">
                                FAMILY HISTORY
                            </label>
                            <Textarea id="familyHistory" placeholder="Describe the family medical history..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="socialHistory">
                                SOCIAL HISTORY
                            </label>
                            <Textarea id="socialHistory" placeholder="Include any relevant social history..." />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="followUp" />
                            <label className="text-sm font-medium leading-none" htmlFor="followUp">
                                Follow up
                            </label>
                        </div>
                        <Input placeholder="Date of next appointment" />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
                    </div>
                </div>
            )}
        </>
    )
}

