// components/auth/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';
import { useRouter } from 'next/navigation';
import { ScaleLoader } from 'react-spinners';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();
    const { setToast } = useToast();

    useEffect(() => {
        if (session && !session.user?.isAdmin) {
            setToast?.({
                title: 'Error',
                description: 'This page is for admins only.',
                variant: 'error',
            });
            router.push('/');
        }
        const fetchPendingUsers = async () => {
            if (session?.user?.isAdmin) {
                try {
                    const res = await fetch('/api/admin/users');
                    if (!res.ok) throw new Error('Failed to fetch users');
                    const data = await res.json();
                    setUsers(data);
                } catch (error) {
                    console.error('Error fetching users:', error);
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
    }, [session, router, setToast]);

    async function handleUserAction(userId: string, actionType: 'approve' | 'deny') {
        if (!session?.user?.token) {
            setToast?.({
                title: 'Error',
                description: 'No authentication token found.',
                variant: 'error',
            });
            return;
        }

        setLoadingUsers((prevState) => ({ ...prevState, [userId]: true }));
        try {
            const url = `/api/auth/signup/${actionType}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${actionType} user`);
            }

            setToast?.({
                title: 'Success',
                description: `User ${actionType === 'approve' ? 'approved' : 'denied'} successfully.`,
                variant: 'default',
            });

            // Remove user from list
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
            console.error(`Error in ${actionType}User:`, error);

            // Safely extract the error message
            const errorMessage = error instanceof Error ? error.message : `An error occurred while trying to ${actionType} the user.`;

            setToast?.({
                title: 'Error',
                description: errorMessage,
                variant: 'error',
            });
        } finally {
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <h2 className="text-2xl font-semibold mb-4">Pending User Approvals</h2>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Actions</th>
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
                            <td className="py-2 px-4 border-b">
                                {loadingUsers[user._id] ? (
                                    <ScaleLoader color="#FFA500" />
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleUserAction(user._id, 'approve')}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(user._id, 'deny')}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Deny
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="py-2 px-4 border-b text-center">
                            No pending approvals.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}