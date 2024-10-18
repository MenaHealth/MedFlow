// components/PatientViewModels/patient-info/PatientInfoView.tsx
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ReadOnlyField from '@/components/form/ReadOnlyField';
import { usePatientDashboard } from '@/components/PatientViewModels/PatientDashboardContext';

const PatientInfoView: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
    const { patientViewModel, loadingPatientInfo } = usePatientDashboard();

    useEffect(() => {
        if (!patientViewModel) {
            // Call fetch function here if patientViewModel is not loaded
        }
    }, [patientViewModel]);

    if (loadingPatientInfo || !patientViewModel) {
        return <div>Loading...</div>;
    }

    const primaryDetails = patientViewModel.getPrimaryDetails();
    const expandedDetails = patientViewModel.getExpandedDetails();

    return (
        <Card className="p-4 bg-orange-50">
            {isExpanded && (
                <CardContent className="space-y-2 bg-orange-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReadOnlyField fieldName="age" fieldLabel="Age" value={expandedDetails.age || 'N/A'}/>
                        <ReadOnlyField fieldName="genderPreference" fieldLabel="Gender Preference" value={expandedDetails.genderPreference || 'N/A'}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReadOnlyField fieldName="dob" fieldLabel="Date of Birth" value={expandedDetails.dob || 'N/A'}/>
                        <ReadOnlyField fieldName="patientID" fieldLabel="Patient ID" value={expandedDetails.patientID || 'N/A'}/>
                    </div>
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
                            <ReadOnlyField fieldName="language" fieldLabel="Language"
                                           value={expandedDetails.language || 'N/A'}/>
                            <ReadOnlyField fieldName="chiefComplaint" fieldLabel="Chief Complaint"
                                           value={expandedDetails.chiefComplaint || 'N/A'}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReadOnlyField fieldName="diagnosis" fieldLabel="Diagnosis"
                                           value={expandedDetails.diagnosis || 'N/A'}/>
                            <ReadOnlyField fieldName="hospital" fieldLabel="Hospital"
                                           value={expandedDetails.hospital || 'N/A'}/>
                        </div>
                    </CardContent>
                )}

        </Card>
    );
};

export default PatientInfoView;