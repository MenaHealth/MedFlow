// components/auth/adminDashboard/sections/DeniedDoctorsAndTriage.tsx

'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import InfiniteScroll from '@/components/ui/infiniteScroll';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    denialDate?: string;
}

interface DeniedDoctorsAndTriageProps {
    data: User[];
    hasMore: boolean;
    loading: boolean;
    next: () => void;
}

export default function DeniedDoctorsAndTriage({
                                                   data,
                                                   hasMore,
                                                   loading,
                                                   next,
                                               }: DeniedDoctorsAndTriageProps) {
    const { data: session } = useSession();
    const { setToast } = useToast();

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);

    // Handle the re-approve-users action
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
            const response = await fetch('/api/admin/POST/re-approve-users', {
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsSelecting(!isSelecting)}
                    className={`border-2 font-bold py-2 px-4 rounded mr-2 ${
                        data.length === 0 ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-grey-800 text-grey-800 hover:bg-grey-800 hover:text-orange-50'
                    }`}
                    disabled={data.length === 0}
                >
                    Select Users
                </button>

                {/* Re-approve-users button - visible in selection mode */}
                {isSelecting && (
                    <button
                        onClick={handleReApprove}
                        className={`border-2 font-bold py-2 px-4 rounded ${
                            selectedUsers.length === 0 ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-green-50'
                        }`}
                        disabled={selectedUsers.length === 0}
                    >
                        Re-approve Users
                    </button>
                )}
            </div>

            {/* Infinite Scroll Table */}
            <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next}>
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
                    {data.length > 0 ? (
                        data.map((user) => (
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
                            <td colSpan={6} className="py-2 px-4 border-b text-center">
                                No denied users.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </InfiniteScroll>
        </div>
    );
}