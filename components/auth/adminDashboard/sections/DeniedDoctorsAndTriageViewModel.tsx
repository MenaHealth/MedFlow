// components/auth/adminDashboard/sections/DeniedDoctorsAndTriageViewModel.tsx

import { useState } from 'react';
import { useQueryClient, useInfiniteQuery, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';
import useToast from '@/components/hooks/useToast';

export function useDeniedDoctorsAndTriageViewModel() {
    const { data: session } = useSession(); // Access the session data
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const queryClient = useQueryClient();
    const { setToast } = useToast(); // Initialize toast hook

    // Fetch denied users with pagination
    const {
        data,
        isLoading: loadingDeniedUsers,
        fetchNextPage: nextDeniedUsers,
        hasNextPage: hasMoreDeniedUsers,
    } = useInfiniteQuery(
        'deniedUsers',
        async ({ pageParam = 1 }) => {
            const res = await fetch(`/api/admin/GET/denied-users?page=${pageParam}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch denied users');
            const result = await res.json();
            return {
                users: result.users,
                nextPage: pageParam + 1,
                hasMore: result.totalPages > pageParam,
            };
        },
        {
            getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
        }
    );

    const deniedUsers = data?.pages.flatMap((page) => page.users) || [];

    // Re-approve users mutation
    const reApproveMutation = useMutation(
        async (userIds: string[]) => {
            const token = session?.user.token;
            if (!token) {
                throw new Error('User is not authenticated');
            }

            const res = await fetch('/api/admin/POST/re-approve-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userIds }),
            });
            if (!res.ok) throw new Error('Failed to re-approve users');
            return res.json();
        },
        {
            onSuccess: () => {
                // Show success toast
                setToast({
                    title: 'Users Re-Approved',
                    description: 'Selected users have been successfully re-approved.',
                    variant: 'success',
                });

                // Clear the selection and refresh denied users data
                setSelectedUsers([]);
                queryClient.invalidateQueries('deniedUsers'); // Re-fetch denied users
            },
            onError: (error: any) => {
                // Show error toast
                setToast({
                    title: 'Error',
                    description: error.message || 'Failed to re-approve users.',
                    variant: 'error',
                });
            },
        }
    );

    const handleReApproveUsers = (userIds: string[] = selectedUsers) => {
        reApproveMutation.mutate(userIds);
    };

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        selectedUsers,
        handleCheckboxChange,
        handleReApproveUsers,
    };
}