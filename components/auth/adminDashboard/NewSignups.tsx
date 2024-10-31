    // components/auth/adminDashboard/PendingUsers.tsx
    'use client';

    import { useState, useEffect } from 'react';
    import { useSession } from 'next-auth/react';
    import useToast from '@/components/hooks/useToast';
    import {ChevronLeftIcon, ChevronRightIcon, UserRoundCheck, UserRoundMinus} from 'lucide-react';
    import { useAdminDashboard } from './AdminDashboardContext';


    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        accountType: 'Doctor' | 'Triage';
        countries?: string[];
    }

    interface PendingUsersProps {
        data: User[];
    }

    interface PendingApprovalsProps {
        data: User[] | null;
    }
    export default function NewSignups({ data }: PendingUsersProps) {
        const { data: session } = useSession();
        const {
            pendingApprovalsData,
            loadingPendingApprovals,
            totalPages,
            currentPage,
            setCurrentPage,
            toggleSection,
        } = useAdminDashboard();

        const { setToast } = useToast();
        const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

        // Handle approve-users or deny-users action
// components/auth/adminDashboard/PendingUsers.tsx
        async function handleBulkAction(actionType: 'approve-users' | 'deny-users') {
            if (!session?.user?.token || selectedUsers.length === 0) {
                setToast?.({
                    title: 'Error',
                    description: 'No users selected or no authentication token found.',
                    variant: 'error',
                });
                return;
            }

            try {
                const url = `/api/admin/POST/${actionType}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: JSON.stringify({ userIds: selectedUsers }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to ${actionType} users`);
                }

                setToast?.({
                    title: 'Success',
                    description: `Selected users ${actionType === 'approve-users' ? 'approved' : 'denied'} successfully.`,
                    variant: 'default',
                });

                // Update the pending approvals data by removing approved/denied users
                setSelectedUsers([]);
                toggleSection('pending'); // Refresh pending approvals after action
            } catch (error) {
                console.error(`Error in bulk ${actionType}:`, error);
                const errorMessage = error instanceof Error ? error.message : `An error occurred while trying to ${actionType} the users.`;
                setToast?.({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'error',
                });
            }
        }

        // Handle individual checkbox selection
        const handleCheckboxChange = (userId: string) => {
            setSelectedUsers((prev) =>
                prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
            );
        };

        const handleSelectAll = () => {
            setSelectedUsers((prev) => (
                prev.length === pendingApprovalsData.length
                    ? []
                    : pendingApprovalsData.map((user: User) => user._id)
            ));
        };

        if (loadingPendingApprovals) {
            return <div>Loading...</div>;
        }

        return (
            <div className="container mx-auto px-4 py-8 bg-orange-50">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => handleBulkAction('approve-users')}
                        className="border-2 border-orange-800 text-orange-800 font-bold hover:bg-orange-800 hover:text-orange-50  py-2 px-4 rounded mr-2"
                        disabled={selectedUsers.length === 0}
                    >
                        <UserRoundCheck className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleBulkAction('deny-users')}
                        className="border-2 border-orange-800 text-orange-800 font-bold hover:bg-orange-800 hover:text-orange-50  py-2 px-4 rounded mr-2"
                        disabled={selectedUsers.length === 0}
                    >
                        <UserRoundMinus className="w-5 h-5" />
                    </button>
                </div>

                {/* Users Table */}
                <table className="min-w-full">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedUsers.length === pendingApprovalsData.length && pendingApprovalsData.length > 0}
                            />
                        </th>
                        <th className="py-2 px-4 border-b text-orange-800">Name</th>
                        <th className="py-2 px-4 border-b text-orange-800">Email</th>
                        <th className="py-2 px-4 border-b text-orange-800">User Type</th>
                        <th className="py-2 px-4 border-b text-orange-800">Country</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pendingApprovalsData.length > 0 ? (
                        pendingApprovalsData.map((user: User) => (
                            <tr key={user._id}>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(user._id)}
                                        checked={selectedUsers.includes(user._id)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.accountType}</td>
                                <td className="py-2 px-4 border-b">{user.countries?.join(', ') || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-2 px-4 border-b text-center">
                                No pending approvals.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {pendingApprovalsData.length > 0 && totalPages > 1 && (
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <span>
                        Page {currentPage} of {totalPages}
                    </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        );
    }