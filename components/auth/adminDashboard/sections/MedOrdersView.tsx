// ADMIN not patient view!!
// components/auth/adminDashboard/sections/MedOrdersView.tsx
import React, { useState } from 'react'
import { Table, TableColumn } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {Loader2, ChevronDown, ChevronRight, Download} from "lucide-react"
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
            header: 'D&T' +
                '',
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
            key: 'patientId',
            id: 'patientId',
            header: 'P. ID',
            width: 'w-40',
            resizable: true,
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientName',
            id: 'patientName',
            header: 'Patient',
            width: 'w-40',
            resizable: true,
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientCity',
            id: 'patientCity',
            header: 'City',
            width: 'w-32',
            resizable: true,
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientCountry',
            id: 'patientCountry',
            header: 'Country',
            width: 'w-32',
            resizable: true,
            hidden: !visibleGroups.patient
        },
        {
            key: 'patientPhone',
            id: 'patientPhone',
            header: 'P. Phone',
            width: 'w-40',
            resizable: true,
            hidden: !visibleGroups.patient
        },
        {
            key: 'drId',
            id: 'drId',
            header: 'Dr. ID',
            width: 'w-40',
            resizable: true,
            hidden: !visibleGroups.doctor
        },
        {
            key: 'prescribingDr',
            id: 'prescribingDr',
            header: 'Dr',
            width: 'w-40',
            resizable: true,
            hidden: !visibleGroups.doctor
        },
        {
            key: 'doctorSpecialty',
            id: 'doctorSpecialty',
            header: 'Specialty',
            width: 'w-32',
            resizable: true,
            hidden: !visibleGroups.doctor
        },
        {
            key: 'medications-diagnosis',
            id: 'medications-diagnosis',
            header: 'Diagnosis',
            width: 'w-40',
            resizable: true,
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
            resizable: true,
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
            resizable: true,
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
            resizable: true,
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
            resizable: true,
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

    const exportToCSV = () => {
        // Include all columns except those with custom render functions
        const exportableColumns = columns.filter(column => !column.render && !column.hidden);
        const headers = exportableColumns.map(column => column.header);

        const csvContent = [
            headers.join(','),
            ...medOrders.map(order =>
                exportableColumns.map(column => {
                    const key = column.key as keyof IMedOrder;
                    const value = order[key];
                    if (Array.isArray(value)) {
                        // For array values, join them with commas
                        return value.join(', ');
                    }
                    if (key === 'orderDate') {
                        // Format date
                        return new Date(value as Date).toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit'
                        });
                    }
                    return value?.toString() || '';
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'med_orders.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loadingMedOrders && (!medOrders || medOrders.length === 0)) {
        return (
            <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-white"/>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex flex-wrap items-center">
                <GroupToggleButton group="patient" label="Patient Info" />
                <GroupToggleButton group="doctor" label="Doctor Info" />
                <GroupToggleButton group="medications" label="Medications" />
                <Button
                    onClick={exportToCSV}
                    variant="outline"
                    size="sm"
                    className="ml-auto text-orange-950 border-2 border-white hover:bg-orange-800 hover:text-white transition-colors"
                    disabled={!medOrders || medOrders.length === 0}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>
            {medOrders && medOrders.length > 0 ? (
                <div className="rounded-lg overflow-hidden border border-orange-900">
                    <Table
                        data={medOrders as unknown as IMedOrder[]}
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
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={nextMedOrders}
                        variant="secondary"
                        className="flex items-center justify-center text-center py-4"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {loadingMedOrders && medOrders && medOrders.length > 0 && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white"/>
                </div>
            )}
        </div>
    )
}