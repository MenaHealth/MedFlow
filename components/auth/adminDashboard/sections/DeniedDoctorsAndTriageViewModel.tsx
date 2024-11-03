// components/auth/adminDashboard/sections/DeniedDoctorsAndTriageViewModel.tsx

import { useState } from 'react';
import { useQueryClient, useInfiniteQuery, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

export function useDeniedDoctorsAndTriageViewModel() {
    const { data: session } = useSession(); // Access the session data
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const queryClient = useQueryClient();

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
            // Use the JWT token from the session
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
                // Clear the selection and refresh denied users data
                setSelectedUsers([]);
                queryClient.invalidateQueries('deniedUsers'); // Re-fetch denied users
            },
        }
    );

    const handleReApproveUsers = () => {
        reApproveMutation.mutate(selectedUsers);
    };

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const toggleSelecting = () => {
        setIsSelecting((prev) => !prev);
    };

    return {
        deniedUsers,
        loadingDeniedUsers,
        hasMoreDeniedUsers,
        nextDeniedUsers,
        isSelecting,
        toggleSelecting,
        selectedUsers,
        handleCheckboxChange,
        handleReApproveUsers, // Expose re-approve function
    };
}