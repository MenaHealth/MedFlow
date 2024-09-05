"use client"; 
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import PatientSubmenu from '../../components/PatientSubmenu';  // Ensure you import the PatientSubmenu

const RXForm: React.FC = () => {
    const [rxData, setRxData] = useState({
        fullName: '',
        phoneNumber: '',
        age: '',
        address: '',
        patientIDNumber: '',
        referringDr: '',
        prescribingDr: '',
        diagnosis: '',
        medicationsNeeded: '',
        pharmacyLocation: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRxData({
            ...rxData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        console.log('RX Form Data:', rxData);
    };

    return (
        <div>
            <PatientSubmenu />
            <div className="container mx-auto p-4 flex flex-col md:flex-row" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
                <div className="w-full md:w-3/4 bg-white p-4">
                    <Typography variant="h5" gutterBottom>
                        RX for Patient {rxData.patientIDNumber}
                    </Typography>
                    <form>
                        <TextField
                            label="Full Name (الاسم الكامل)"
                            name="fullName"
                            variant="outlined"
                            fullWidth
                            value={rxData.fullName}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Phone Number (رقم الهاتف)"
                            name="phoneNumber"
                            variant="outlined"
                            fullWidth
                            value={rxData.phoneNumber}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Age (العمر)"
                            name="age"
                            variant="outlined"
                            fullWidth
                            value={rxData.age}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Address / Area Located (العنوان)"
                            name="address"
                            variant="outlined"
                            fullWidth
                            value={rxData.address}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient ID Number #"
                            name="patientIDNumber"
                            variant="outlined"
                            fullWidth
                            value={rxData.patientIDNumber}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Referring Dr(دكتور محيل)"
                            name="referringDr"
                            variant="outlined"
                            fullWidth
                            value={rxData.referringDr}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Prescribing Dr(طبيب واصف)"
                            name="prescribingDr"
                            variant="outlined"
                            fullWidth
                            value={rxData.prescribingDr}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Diagnosis(تشخيص)"
                            name="diagnosis"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={rxData.diagnosis}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Medications Needed (الأدوية المطلوبة)"
                            name="medicationsNeeded"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={rxData.medicationsNeeded}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Pharmacy Location (من أي صيدلية سيتم استلام الدواء؟)"
                            name="pharmacyLocation"
                            variant="outlined"
                            fullWidth
                            value={rxData.pharmacyLocation}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit RX
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RXForm;

