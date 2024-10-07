import React from 'react';
import { AdminDashboardProvider, useAdminDashboard } from './AdminDashboardContext';
import PendingUsers from './PendingUsers';
import DeniedUsers from './DeniedUsers';
import ExistingUsers from './ExistingUsers';
import AdminManagement from "@/components/auth/admin/AdminManagement";
import { BarLoader } from 'react-spinners';

const AdminDashboardContent = () => {
    const {
        isPendingApprovalsOpen,
        isExistingUsersOpen,
        isDeniedUsersOpen,
        isAddAdminUsersOpen,
        loadingPendingApprovals,
        loadingExistingUsers,
        loadingDeniedUsers,
        pendingApprovalsData,
        existingUsersData,
        deniedUsersData,
        toggleSection,
        totalPages,
        currentPage,
        setCurrentPage
    } = useAdminDashboard();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-darkBlue text-center">Admin Dashboard</h1>

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
                        {loadingPendingApprovals ? (
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
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExistingUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-orange-100">
                        {loadingExistingUsers ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--yellow-500)" />
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
            <div className="mb-8 bg-grey-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                <div
                    className="flex justify-between items-center cursor-pointer p-4 bg-grey-100"
                    onClick={() => toggleSection('denied')}
                >
                    <h2 className="text-2xl font-semibold text-grey-800">Denied Users</h2>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDeniedUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 overflow-x-auto bg-grey-100">
                        {loadingDeniedUsers ? (
                            <div className="flex justify-center items-center py-4">
                                <BarLoader color="var(--grey-500)" />
                            </div>
                        ) : (
                            <DeniedUsers data={deniedUsersData} />
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
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAddAdminUsersOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <AdminManagement />
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => (
    <AdminDashboardProvider>
        <AdminDashboardContent />
    </AdminDashboardProvider>
);

export default AdminDashboard;