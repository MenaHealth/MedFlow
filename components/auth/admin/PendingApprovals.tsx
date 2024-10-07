// components/auth/admin/PendingApprovals.tsx

'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAdminDashboard } from '@/components/auth/admin/AdminDashboardContext';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
}

interface PendingApprovalsProps {
    data: User[] | null;
}

export default function PendingApprovals({ data }: PendingApprovalsProps) {
    const { data: session } = useSession();
    const { pendingApprovalsData, totalPages, currentPage, setCurrentPage, isRefreshing } = useAdminDashboard();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});
    const { setToast } = useToast();

    // Handle approve-users or deny-users action
    async function handleBulkAction(actionType: 'approve' | 'deny') {
        if (!session?.user?.token || selectedUsers.length === 0) {
            setToast?.({
                title: 'Error',
                description: 'No users selected or no authentication token found.',
                variant: 'error',
            });
            return;
        }

        setLoadingUsers((prevState) => {
            const newState = { ...prevState };
            selectedUsers.forEach((userId) => {
                newState[userId] = true;
            });
            return newState;
        });

        try {
            const url = `/api/admin/POST/${actionType === 'approve' ? 'approve-users' : 'deny-users'}`;
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
                description: `Selected users ${actionType === 'approve' ? 'approved' : 'denied'} successfully.`,
                variant: 'default',
            });

            setSelectedUsers([]); // Clear selection after action is complete
        } catch (error) {
            console.error(`Error in bulk ${actionType}:`, error);
            const errorMessage = error instanceof Error ? error.message : `An error occurred while trying to ${actionType} the users.`;
            setToast?.({
                title: 'Error',
                description: errorMessage,
                variant: 'error',
            });
        } finally {
            setLoadingUsers({});
        }
    }

    // Handle individual checkbox selection
    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

// Handle select all users in the list
    const handleSelectAll = () => {
        setSelectedUsers((prev) => (prev.length === pendingApprovalsData.length ? [] : pendingApprovalsData.map((user: User) => user._id)));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <button
                    onClick={() => handleBulkAction('approve')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
                    disabled={selectedUsers.length === 0 || isRefreshing}
                >
                    Approve Selected
                </button>
                <button
                    onClick={() => handleBulkAction('deny')}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    disabled={selectedUsers.length === 0 || isRefreshing}
                >
                    Deny Selected
                </button>
            </div>

            {/* Users Table */}
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedUsers.length === pendingApprovalsData.length && pendingApprovalsData.length > 0}
                        />
                    </th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">User Type</th>
                    <th className="py-2 px-4 border-b">Country</th>
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