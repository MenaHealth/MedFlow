// components/auth/admin/DeniedUsers.tsx
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
    denialDate?: string;
}

interface DeniedUsersProps {
    data: User[] | null;
}

export default function DeniedUsers({ data }: DeniedUsersProps) {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { setToast } = useToast();

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

    return (
        <div className="container mx-auto px-4 py-8">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">User Type</th>
                    <th className="py-2 px-4 border-b">Country</th>
                    <th className="py-2 px-4 border-b">Denial Date</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user._id}>
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