// components/auth/admin/DeniedUsers.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { ChevronLeft, ChevronRight, UserRoundPen, UserRoundCheck } from 'lucide-react';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    denialDate?: string;
}

interface DeniedUsersProps {
    data: User[] | null;
}

export default function DeniedUsers({ data }: DeniedUsersProps) {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { setToast } = useToast();
    const [isSelecting, setIsSelecting] = useState(false);

    useEffect(() => {
        const fetchDeniedUsers = async () => {
            if (session?.user?.isAdmin) {
                try {
                    const res = await fetch(`/api/admin/denied-users?page=${currentPage}&limit=20`);
                    if (!res.ok) throw new Error('Failed to fetch denied users');
                    const data = await res.json();
                    setUsers(data.users);
                    setTotalPages(data.totalPages);
                } catch (error) {
                    console.error('Error fetching denied users:', error);
                    setToast?.({
                        title: 'Error',
                        description: 'Failed to fetch denied users.',
                        variant: 'error',
                    });
                }
            }
        };

        if (session?.user?.isAdmin) {
            fetchDeniedUsers();
        }
    }, [session, currentPage, setToast]);

    // Handle the re-approve action
    const handleReApprove = async () => {
        if (!session?.user?.isAdmin) {
            setToast?.({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'error',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ userIds: selectedUsers }),
            });

            if (!response.ok) {
                throw new Error('Failed to re-approve users');
            }

            setToast?.({
                title: 'Success',
                description: 'Users re-approved successfully.',
                variant: 'default',
            });

            // Remove the re-approved users from the current list
            setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user._id)));
            setSelectedUsers([]);  // Clear selected users after re-approval
            setIsSelecting(false);  // Exit selection mode after successful re-approval
        } catch (error) {
            console.error('Error re-approving users:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to re-approve users.',
                variant: 'error',
            });
        }
    };

    // Handle checkbox selection
    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div className="container bg mx-auto px-4 py-8 bg-grey-100">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsSelecting(!isSelecting)}
                    className={`border-2 font-bold py-2 px-4 rounded mr-2 ${
                        users.length === 0
                            ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                            : 'border-grey-800 text-grey-800 hover:bg-grey-800 hover:text-orange-50'
                    }`}
                    disabled={users.length === 0}
                >
                    <UserRoundPen className="w-5 h-5" />
                </button>

                {/* Re-approve button - visible in selection mode */}
                {isSelecting && (
                    <button
                        onClick={handleReApprove}
                        className={`border-2 font-bold py-2 px-4 rounded ${
                            selectedUsers.length === 0
                                ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                                : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-green-50'
                        }`}
                        disabled={selectedUsers.length === 0}
                    >
                        <UserRoundCheck className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Users Table */}
            <table className="min-w-full">
                <thead>
                <tr>
                    {isSelecting && <th className="py-2 px-4 border-b text-grey-800">Select</th>}
                    <th className="py-2 px-4 border-b text-grey-800">Name</th>
                    <th className="py-2 px-4 border-b text-grey-800">Email</th>
                    <th className="py-2 px-4 border-b text-grey-800">User Type</th>
                    <th className="py-2 px-4 border-b text-grey-800">Country</th>
                    <th className="py-2 px-4 border-b text-grey-800">Denial Date</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user._id}>
                            {isSelecting && (
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(user._id)}
                                        checked={selectedUsers.includes(user._id)}
                                    />
                                </td>
                            )}
                            <td className="py-2 px-4 border-b">
                                {user.firstName} {user.lastName}
                            </td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{user.accountType}</td>
                            <td className="py-2 px-4 border-b">{user.countries?.join(', ') || 'N/A'}</td>
                            <td className="py-2 px-4 border-b">
                                {user.denialDate ? new Date(user.denialDate).toLocaleDateString() : 'N/A'}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="py-2 px-4 border-b text-center">
                            No denied users.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {users.length > 0 && totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}