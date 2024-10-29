// components/auth/adminDashboard/AdminDashboardView.tsx

import React from 'react';
import { AdminDashboardProvider, useAdminDashboard } from './AdminDashboardContext';
import PendingUsers from './PendingUsers';
import DeniedUsers from './DeniedUsers';
import ExistingUsers from './ExistingUsers';
import AdminManagement from "@/components/auth/adminDashboard/AdminManagement";
import { BarLoader } from 'react-spinners';
import { ListRestart } from 'lucide-react';

const AdminDashboardContent = () => {
    const {
        isPendingApprovalsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        isMedOrderOpen,              // Added for Med Orders
        loadingPendingApprovals,
        loadingExistingUsers,
        loadingDeniedUsers,
        loadingMedOrders,             // Added for Med Orders
        pendingApprovalsData,
        existingUsersData,
        deniedUsersData,
        medOrdersData,                // Added for Med Orders
        toggleSection,
        totalPages,
        currentPage,
        setCurrentPage,
        handleRefresh,
        isRefreshing
    } = useAdminDashboard();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-darkBlue">Admin Dashboard</h1>
                <button
                    className="text-orange-500 hover:border-orange-500 border-transparent border-2 py-2 px-4 rounded focus:outline-none focus:border-orange-500"
                    onClick={handleRefresh}
                >
                    <ListRestart/>
                </button>
            </div>

            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-orange-50"
                    onClick={() => toggleSection('pending')}
                >
                    <h2 className="text-2xl font-semibold text-orange-800">Pending User Approvals</h2>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isPendingApprovalsOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-orange-50">
                        {(loadingPendingApprovals || isRefreshing) ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--orange-500)"/>
                            </div>
                        ) : (
                            <PendingUsers data={pendingApprovalsData}/>
                        )}
                    </div>
                </div>
            </div>

            {/* Existing Users */}
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-orange-100"
                    onClick={() => toggleSection('existing')}
                >
                    <h2 className="text-2xl font-semibold text-orange-500">Existing Users</h2>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExistingUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-orange-100">
                        {(loadingExistingUsers || isRefreshing) ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--yellow-500)"/>
                            </div>
                        ) : (
                            <ExistingUsers
                                data={existingUsersData}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Denied Users */}
            <div
                className="mb-8 bg-grey-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-grey-100"
                    onClick={() => toggleSection('denied')}
                >
                    <h2 className="text-2xl font-semibold text-grey-800">Denied Users</h2>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isDeniedUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-grey-100">
                        {(loadingDeniedUsers || isRefreshing) ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--grey-500)"/>
                            </div>
                        ) : (
                            <DeniedUsers data={deniedUsersData}/>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Admin Users */}
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-darkBlue"
                    onClick={() => toggleSection('addAdmin')}
                >
                    <h2 className="text-2xl font-semibold text-orange-100">Admin Management</h2>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isAddAdminUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <AdminManagement/>
                </div>
            </div>


            {/* Med Orders Section */}
            <div className="mb-8 bg-darkBlue text-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-darkBlue"
                    onClick={() => toggleSection('medOrder')}
                >
                    <h2 className="text-2xl font-semibold text-orange-100">Med Orders</h2>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isMedOrderOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-darkBlue">
                        {(loadingMedOrders || isRefreshing) ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--orange-500)" />
                            </div>
                        ) : (
                            medOrdersData.length > 0 ? (
                                <div>
                                    {medOrdersData.map(order => (
                                        <div key={order._id}
                                             className="bg-white text-darkBlue p-4 mb-4 rounded shadow-md">
                                            <p><strong>Patient:</strong> {order.patientName}</p>
                                            <p><strong>Doctor:</strong> {order.prescribingDr} ({order.doctorSpecialty})
                                            </p>
                                            <p><strong>Medications:</strong></p>
                                            <ul>
                                                {order.medications.map((med: {
                                                    medication: string;
                                                    dosage: string;
                                                    frequency: string;
                                                    quantity: string
                                                }, index: number) => (
                                                    <li key={index}>
                                                        <strong>{med.medication}</strong> - {med.dosage} ({med.frequency}), {med.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-white">No Med Orders found.</p>
                            )
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

const AdminDashboardView = () => (
    <AdminDashboardProvider>
        <AdminDashboardContent/>
    </AdminDashboardProvider>
);

export default AdminDashboardView;