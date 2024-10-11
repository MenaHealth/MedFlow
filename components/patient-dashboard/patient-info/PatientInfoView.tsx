// components/patient-dashboard/patient-info/PatientInfoView.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import ReadOnlyField from '@/components/form/ReadOnlyField'
import { PatientInfoViewModel } from './PatientInfoViewModel'

const PatientInfoView: React.FC<{
    viewModel: PatientInfoViewModel;
    isExpanded: boolean;
}> = ({ viewModel, isExpanded }) => {
    const primaryDetails = viewModel.getPrimaryDetails();
    const expandedDetails = viewModel.getExpandedDetails();

    return (
        <Card className="p-4 bg-orange-50">
            <CardContent className="space-y-2 bg-orange-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField fieldName="age" fieldLabel="Age" value={primaryDetails.age || 'N/A'}/>
                    <ReadOnlyField fieldName="genderPreference" fieldLabel="Gender Preference" value={primaryDetails.genderPreference || 'N/A'}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField fieldName="dob" fieldLabel="Date of Birth" value={primaryDetails.dob ? primaryDetails.dob.toLocaleDateString() : 'N/A'}/>
                    <ReadOnlyField fieldName="patientID" fieldLabel="Patient ID" value={primaryDetails.patientID || 'N/A'}/>
                </div>

                {isExpanded && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField fieldName="phone" fieldLabel="Phone" value={expandedDetails.phone || 'N/A'}/>
                            <ReadOnlyField fieldName="email" fieldLabel="Email" value={expandedDetails.email || 'N/A'}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField fieldName="country" fieldLabel="Country" value={expandedDetails.country || 'N/A'}/>
                            <ReadOnlyField fieldName="city" fieldLabel="City" value={expandedDetails.city || 'N/A'}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField fieldName="language" fieldLabel="Language" value={expandedDetails.language || 'N/A'}/>
                            <ReadOnlyField fieldName="chiefComplaint" fieldLabel="Chief Complaint" value={expandedDetails.chiefComplaint || 'N/A'}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField fieldName="diagnosis" fieldLabel="Diagnosis" value={expandedDetails.diagnosis || 'N/A'}/>
                            <ReadOnlyField fieldName="hospital" fieldLabel="Hospital" value={expandedDetails.hospital || 'N/A'}/>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default PatientInfoView;