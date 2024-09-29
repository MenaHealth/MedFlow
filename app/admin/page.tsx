// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useToast from '@/components/hooks/useToast';

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);
    const router = useRouter();
    const { setToast } = useToast();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            signIn();
        }

        // Check if the user is an admin, otherwise show an error
        if (session && session.user && !session.user.isAdmin) {
            setToast?.({ title: 'Error', description: 'This page is for admins only.', variant: 'error' });
            router.push('/');  // Using router.push instead of router.replace in app router
        }

        // Fetch the list of users pending approval (if admin)
        const fetchPendingUsers = async () => {
            if (session?.user?.isAdmin) {
                const res = await fetch('/api/admin/users');  // API route to fetch users
                const data = await res.json();
                setUsers(data);
            }
        };

        fetchPendingUsers();
    }, [session, status, router, setToast]);

    const approveUser = async (userId: string) => {
        try {
            const token = sessionStorage.getItem('jwtToken');  // Assuming you're storing the token in sessionStorage
            const res = await fetch('/api/auth/signup/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include the Authorization header
                },
                body: JSON.stringify({ userId }),
            });
            if (res.ok) {
                setToast?.({ title: 'Success', description: 'User approved successfully.', variant: 'default' });
                setUsers(users.filter(user => user._id !== userId));
            } else {
                throw new Error('Failed to approve user');
            }
        } catch (error) {
            setToast?.({ title: 'Error', description: 'An error occurred while approving the user.', variant: 'error' });
        }
    };

    const denyUser = async (userId: string) => {
        try {
            const res = await fetch('/api/auth/signup/deny', {
                method: 'POST',
                body: JSON.stringify({ userId }),
            });
            if (res.ok) {
                setToast?.({ title: 'Success', description: 'User denied successfully.', variant: 'default' });
                setUsers(users.filter(user => user._id !== userId));
            } else {
                throw new Error('Failed to deny user');
            }
        } catch (error) {
            setToast?.({ title: 'Error', description: 'An error occurred while denying the user.', variant: 'error' });
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Pending User Approvals</h2>
            {users.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => approveUser(user._id)}>Approve</button>
                                <button onClick={() => denyUser(user._id)}>Deny</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No pending approvals.</p>
            )}
        </div>
    );
};

export default AdminDashboard;