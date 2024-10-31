// components/auth/adminDashboard/AdminDashboardView.tsx

'use client'

import React, { useRef, useEffect, useState } from 'react'
import { AdminDashboardProvider, useAdminDashboard } from './AdminDashboardContext'
import NewSignups from './NewSignups'
import DeniedDoctorsAndTriage from './DeniedDoctorsAndTriage'
import ExistingDoctorsAndTriage from './ExistingDoctorsAndTriage'
import MedOrders from './MedOrders'
import AdminManagement from "@/components/auth/adminDashboard/AdminManagement"
import { Loader2, RefreshCw, Users, UserCheck, UserX, Pill, ShieldCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"

const sections = [
    { id: 'pending', title: 'New Signups', icon: Users, color: 'bg-orange-50 text-orange-800' },
    { id: 'existing', title: 'Existing Doctors and Triage', icon: UserCheck, color: 'bg-orange-100 text-orange-500' },
    { id: 'denied', title: 'Denied Doctors and Triage', icon: UserX, color: 'bg-gray-100 text-gray-800' },
    { id: 'addAdmin', title: 'Admin Management', icon: ShieldCheck, color: 'bg-darkBlue text-orange-100' },
    { id: 'medOrder', title: 'Medical Orders', icon: Pill, color: 'bg-darkBlue text-orange-100' },
]

const AdminDashboardContent = () => {
    const {
        isPendingApprovalsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        isMedOrderOpen,
        loadingPendingApprovals,
        loadingExistingUsers,
        loadingDeniedUsers,
        loadingMedOrders,
        pendingApprovalsData,
        existingUsersData,
        deniedUsersData,
        medOrdersData,
        toggleSection,
        totalPages,
        currentPage,
        setCurrentPage,
        handleRefresh,
        isRefreshing
    } = useAdminDashboard()

    const [activeSection, setActiveSection] = useState('pending')

    const sectionRefs = useRef<React.RefObject<HTMLDivElement>[]>(sections.map(() => React.createRef<HTMLDivElement>()))

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { threshold: 0.5 }
        )

        sectionRefs.current.forEach((ref) => {
            if (ref.current instanceof HTMLDivElement) {
                observer.observe(ref.current)
            }
        })

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref.current instanceof HTMLDivElement) {
                    observer.unobserve(ref.current)
                }
            })
        }
    }, [])

    const renderSection = (section: typeof sections[number], index: number) => {
        const isOpen = {
            pending: isPendingApprovalsOpen,
            existing: isExistingUsersOpen,
            denied: isDeniedUsersOpen,
            addAdmin: isAddAdminUsersOpen,
            medOrder: isMedOrderOpen,
        }[section.id as 'pending' | 'existing' | 'denied' | 'addAdmin' | 'medOrder']

        const content = {
            pending: <NewSignups data={pendingApprovalsData} />,
            existing: (
                <ExistingDoctorsAndTriage
                    data={existingUsersData}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            ),
            denied: <DeniedDoctorsAndTriage data={deniedUsersData} />,
            addAdmin: <AdminManagement />,
            medOrder: (
                <MedOrders
                    loadingMedOrders={loadingMedOrders}
                    isRefreshing={isRefreshing}
                    medOrdersData={medOrdersData}
                />
            ),
        }[section.id as 'pending' | 'existing' | 'denied' | 'addAdmin' | 'medOrder']

        const loading = {
            pending: loadingPendingApprovals,
            existing: loadingExistingUsers,
            denied: loadingDeniedUsers,
            addAdmin: false,
            medOrder: loadingMedOrders,
        }[section.id as 'pending' | 'existing' | 'denied' | 'addAdmin' | 'medOrder']

        return (
            <div key={section.id} id={section.id} ref={sectionRefs.current[index]} className="mb-6">
                <div className={`sticky top-0 z-10 ${section.color}`}>
                    <button
                        className="w-full p-4 text-left flex items-center justify-between"
                        onClick={() => toggleSection(section.id as 'pending' | 'existing' | 'denied' | 'addAdmin' | 'medOrder')}
                    >
                        <div className="flex items-center">
                            {/* Apply conditional background color only when section is active */}
                            {/*<section.icon className={`mr-2 ${activeSection === section.id ? section.color : ''}`}/>*/}
                            <h2 className="text-xl">{section.title}</h2>
                        </div>
                        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}> ▼ </span>
                    </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className={`p-4 ${section.color}`}>
                        {loading || isRefreshing ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="h-8 w-8 animate-spin"/>
                            </div>
                        ) : (
                            content
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-darkBlue">Admin Dashboard</h1>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="text-orange-500 hover:border-orange-500 border-transparent border-2 focus:outline-none focus:border-orange-500"
                >
                    {isRefreshing ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        <RefreshCw className="h-4 w-4"/>
                    )}
                </Button>
            </div>

            {sections.map((section, index) => renderSection(section, index))}
        </div>
    )
}

const AdminDashboardView = () => (
    <AdminDashboardProvider>
        <AdminDashboardContent/>
    </AdminDashboardProvider>
)

export default AdminDashboardView