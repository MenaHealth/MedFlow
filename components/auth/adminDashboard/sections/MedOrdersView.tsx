import React, { useState } from 'react'
import { Table, TableColumn } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { useMedOrdersViewModel } from './MedOrderViewModel'
import { IMedOrder } from '@/models/medOrder'

export default function MedOrdersView() {
    const {
        medOrders,
        loadingMedOrders,
        hasMoreMedOrders,
        nextMedOrders,
    } = useMedOrdersViewModel()

    const [visibleGroups, setVisibleGroups] = useState({
        patient: true,
        doctor: true,
        medications: true,
    })

    const toggleGroup = (group: keyof typeof visibleGroups) => {
        setVisibleGroups(prev => ({ ...prev, [group]: !prev[group] }))
    }

    const columns: TableColumn<IMedOrder>[] = [
        {
            key: 'orderDate',
            id: 'orderDate',
            header: 'Date Order Placed',
            width: 'w-32',
            render: (value) => new Date(value as Date).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                month: '2-digit',
                day: '2-digit',
                year: '2-digit'
            })
        },
        {
            key: 'patientName',
            id: 'patientName',
            header: 'Patient Name',
            width: 'w-40',
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientCity',
            id: 'patientCity',
            header: 'City',
            width: 'w-32',
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientCountry',
            id: 'patientCountry',
            header: 'Country',
            width: 'w-32',
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientPhone',
            id: 'patientPhone',
            header: 'Patient Phone',
            width: 'w-40',
            hidden: !visibleGroups.patient
        },
        {
            key: 'prescribingDr',
            id: 'prescribingDr',
            header: 'Dr Name',
            width: 'w-40',
            hidden: !visibleGroups.doctor
        },
        {
            key: 'doctorSpecialty',
            id: 'doctorSpecialty',
            header: 'Dr Specialty',
            width: 'w-32',
            hidden: !visibleGroups.doctor
        },
        {
            key: 'medications-diagnosis',
            id: 'medications-diagnosis',
            header: 'Diagnosis',
            width: 'w-40',
            hidden: !visibleGroups.doctor,
            render: (value, item: IMedOrder) => {
                if (!item.medications?.length) return null;
                return (
                    <div className="space-y-1">
                        {item.medications.map((med, index) => (
                            <div key={`${item._id}-diagnosis-${index}`} className="text-sm">
                                {med.diagnosis}
                                {index < item.medications.length - 1 && <hr className="border-orange-900 my-1" />}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'medications-name',
            id: 'medications-name',
            header: 'Medicine Name',
            width: 'w-40',
            hidden: !visibleGroups.medications,
            render: (value, item: IMedOrder) => {
                if (!item.medications?.length) return null;
                return (
                    <div className="space-y-1">
                        {item.medications.map((med, index) => (
                            <div key={`${item._id}-name-${index}`} className="text-sm">
                                {med.diagnosis}
                                {index < item.medications.length - 1 && <hr className="border-orange-900 my-1" />}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'medications-dosage',
            id: 'medications-dosage',
            header: 'Dosage',
            width: 'w-32',
            hidden: !visibleGroups.medications,
            render: (value, item: IMedOrder) => {
                if (!item.medications?.length) return null;
                return (
                    <div className="space-y-1">
                        {item.medications.map((med, index) => (
                            <div key={`${item._id}-dosage-${index}`} className="text-sm">
                                {med.diagnosis}
                                {index < item.medications.length - 1 && <hr className="border-orange-900 my-1" />}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'medications-frequency',
            id: 'medications-frequency',
            header: 'Frequency',
            width: 'w-40',
            hidden: !visibleGroups.medications,
            render: (value, item: IMedOrder) => {
                if (!item.medications?.length) return null;
                return (
                    <div className="space-y-1">
                        {item.medications.map((med, index) => (
                            <div key={`${item._id}-frequency-${index}`} className="text-sm">
                                {med.diagnosis}
                                {index < item.medications.length - 1 && <hr className="border-orange-900 my-1" />}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'medications-quantity',
            id: 'medications-quantity',
            header: 'Quantity',
            width: 'w-24',
            hidden: !visibleGroups.medications,
            render: (value, item: IMedOrder) => {
                if (!item.medications?.length) return null;
                return (
                    <div className="space-y-1">
                        {item.medications.map((med, index) => (
                            <div key={`${item._id}-quantity-${index}`} className="text-sm">
                                {med.diagnosis}
                                {index < item.medications.length - 1 && <hr className="border-orange-900 my-1" />}
                            </div>
                        ))}
                    </div>
                );
            }
        }
    ]

    const GroupToggleButton = ({ group, label }: { group: keyof typeof visibleGroups, label: string }) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleGroup(group)}
            className="mr-2 mb-2"
        >
            {visibleGroups[group] ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            {label}
        </Button>
    )

    if (loadingMedOrders && (!medOrders || medOrders.length === 0)) {
        return (
            <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-white"/>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <GroupToggleButton group="patient" label="Patient Info" />
                <GroupToggleButton group="doctor" label="Doctor Info" />
                <GroupToggleButton group="medications" label="Medications" />
            </div>
            {medOrders && medOrders.length > 0 ? (
                <div className="rounded-lg overflow-hidden border border-orange-900">
                    <Table
                        data={medOrders}
                        columns={columns}
                        onRowClick={(item) => console.log('Clicked item:', item)}
                        backgroundColor="bg-orange-950"
                        textColor="text-white"
                        borderColor="border-orange-900"
                        headerBackgroundColor="bg-orange-900"
                        headerTextColor="text-white"
                        hoverBackgroundColor="hover:bg-orange-900/50"
                        hoverTextColor="hover:text-white"
                        stickyHeader={true}
                    />
                </div>
            ) : (
                <p className="text-center py-4 text-white">No Medical Orders found.</p>
            )}

            {hasMoreMedOrders && (
                <Button
                    onClick={nextMedOrders}
                    className="mt-4 bg-orange-500 text-white hover:bg-orange-600"
                >
                    Load More
                </Button>
            )}

            {loadingMedOrders && medOrders && medOrders.length > 0 && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white"/>
                </div>
            )}
        </div>
    )
}