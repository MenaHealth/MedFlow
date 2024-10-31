// components/auth/adminDashboard/ExistingUsers.tsx
'use client';

import React from 'react';
import { Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    countries?: string[];
    approvalDate?: string;
}

interface ExistingUsersProps {
    data: User[] | null;
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export default function ExistingDoctorsAndTriage({ data, totalPages, currentPage, setCurrentPage }: ExistingUsersProps) {
    const { data: session } = useSession();
    const { setToast } = useToast();

    const handleMoveToDenied = async (userId: string) => {
        if (!session?.user?.isAdmin) {
            setToast?.({
                title: 'Error',
                description: 'You do not have permission to perform this action.',
                variant: 'error',
            });
            return;
        }

        try {
            const response = await fetch('/api/admin/POST/deny-existing-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ userIds: [userId] }),
            });

            if (!response.ok) throw new Error('Failed to move user to denied status');

            setToast?.({
                title: 'Success',
                description: 'User moved to denied status successfully.',
                variant: 'default',
            });

            // Optionally, refresh data or remove the user from the UI after success
        } catch (error) {
            console.error('Error moving user to denied status:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to move user to denied status.',
                variant: 'error',
            });
        }
    };

    if (!data || data.length === 0) {
        return <div className="text-center py-4">No existing users.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-orange-100 text-darkBlue">
            <table className="min-w-full">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-orange-500">Name</th>
                    <th className="py-2 px-4 border-b text-orange-500">Email</th>
                    <th className="py-2 px-4 border-b text-orange-500">User Type</th>
                    <th className="py-2 px-4 border-b text-orange-500">Country</th>
                    <th className="py-2 px-4 border-b text-orange-500">Approval Date</th>
                    <th className="py-2 px-4 border-b text-orange-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(data) && data.map((user, index) => (
                    <tr key={user._id}>
                        <td className="py-2 px-4 border-b">{user.firstName} {user.lastName}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.accountType}</td>
                        <td className="py-2 px-4 border-b">{user.countries?.join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">
                            {user.approvalDate ? new Date(user.approvalDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">
                            {index !== 0 ? (
                                <button
                                    onClick={() => handleMoveToDenied(user._id)}
                                    className="border-2 border-orange-500 text-orange-500 font-bold hover:bg-orange-500 hover:text-orange-50 py-2 px-4 rounded mr-2"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                            ) : (
                                <span className="text-orange-50 bg-orange-500"> Root</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}