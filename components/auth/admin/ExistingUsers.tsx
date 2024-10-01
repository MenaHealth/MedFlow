// components/auth/admin/ExistingUsers.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import {ChevronLeft, ChevronRight, Minus} from 'lucide-react';

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
}

export default function ExistingUsers({ data }: ExistingUsersProps) {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { setToast } = useToast();

    useEffect(() => {
        const fetchExistingUsers = async () => {
            if (session?.user?.isAdmin) {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/admin/existing-users?page=${currentPage}&limit=20`);
                    if (!res.ok) throw new Error('Failed to fetch existing users');
                    const data = await res.json();
                    setUsers(data.users || []);
                    setTotalPages(data.totalPages || 1);
                } catch (error) {
                    console.error('Error fetching existing users:', error);
                    setToast?.({
                        title: 'Error',
                        description: 'Failed to fetch existing users.',
                        variant: 'error',
                    });
                    setUsers([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (session?.user?.isAdmin) {
            fetchExistingUsers();
        }
    }, [session, currentPage, setToast]);

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
            const response = await fetch('/api/admin/move-to-denied', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to move user to denied status');
            }

            setToast?.({
                title: 'Success',
                description: 'User moved to denied status successfully.',
                variant: 'default',
            });

            // Remove the user from the current list
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
            console.error('Error moving user to denied status:', error);
            setToast?.({
                title: 'Error',
                description: 'Failed to move user to denied status.',
                variant: 'error',
            });
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-orange-100 text-darkBlue">
            <table className="min-w-full">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-orange-600">Name</th>
                    <th className="py-2 px-4 border-b text-orange-600">Email</th>
                    <th className="py-2 px-4 border-b text-orange-600">User Type</th>
                    <th className="py-2 px-4 border-b text-orange-600">Country</th>
                    <th className="py-2 px-4 border-b text-orange-600">Approval Date</th>
                    <th className="py-2 px-4 border-b text-orange-600">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <tr key={user._id}>
                            <td className="py-2 px-4 border-b">
                                {user.firstName} {user.lastName} {index === 0 && <span className="text-orange-500">(Admin)</span>}
                            </td>
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
                                        className="border-2 border-orange-600 text-orange-600 font-bold hover:bg-orange-600 hover:text-orange-50  py-2 px-4 rounded mr-2"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <span className="text-gray-500">Admin</span>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="py-2 px-4 border-b text-center">
                            No existing users.
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
                        className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span>
            Page {currentPage} of {totalPages}
        </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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