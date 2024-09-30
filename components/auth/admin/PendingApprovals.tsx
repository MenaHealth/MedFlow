// components/auth/admin/PendingApprovals.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

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
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { setToast } = useToast();

    // Fetch pending users from the server
    useEffect(() => {
        const fetchPendingUsers = async () => {
            if (session?.user?.isAdmin) {
                try {
                    const res = await fetch(`/api/admin/pending-users?page=${currentPage}&limit=20`);
                    if (!res.ok) throw new Error('Failed to fetch pending users');
                    const data = await res.json();
                    setUsers(data.users);
                    setTotalPages(data.totalPages);
                } catch (error) {
                    console.error('Error fetching pending users:', error);
                    setToast?.({
                        title: 'Error',
                        description: 'Failed to fetch pending users.',
                        variant: 'error',
                    });
                }
            }
        };

        if (session?.user?.isAdmin) {
            fetchPendingUsers();
        }
    }, [session, currentPage, setToast]);

    // Handle approve or deny action
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
            const url = `/api/admin/${actionType}`;
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

            setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user._id)));
            setSelectedUsers([]);
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
        setSelectedUsers((prev) => (prev.length === users.length ? [] : users.map((user) => user._id)));
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-orange-50">
            <div className="mb-4">
                <button
                    onClick={() => handleBulkAction('approve')}
                    className="border-2 border-darkBlue hover:bg-darkBlue hover:text-orange-50 text-darkBlue font-bold py-2 px-4 rounded mr-2"
                    disabled={selectedUsers.length === 0}
                >
                    Approve Selected
                </button>
                <button
                    onClick={() => handleBulkAction('deny')}
                    className="border-2 border-darkBlue hover:bg-darkBlue hover:text-orange-50 text-darkBlue font-bold py-2 px-4 rounded mr-2"
                    disabled={selectedUsers.length === 0}
                >
                    Deny Selected
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
                            checked={selectedUsers.length === users.length && users.length > 0}
                        />
                    </th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">User Type</th>
                    <th className="py-2 px-4 border-b">Country</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
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
            {users.length > 0 && totalPages > 1 && (
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