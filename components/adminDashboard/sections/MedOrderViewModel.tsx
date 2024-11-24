// components/auth/adminDashboard/sections/MedOrderViewModel.tsx
import { useInfiniteQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import {IMedOrder} from "@/models/medOrder";

interface MedOrdersResponse {
    orders: IMedOrder[];
    totalPages: number;
    currentPage: number;
}

export function useMedOrdersViewModel() {
    const { data: session } = useSession();
    const token = session?.user.token;

    const fetchAdminMedOrders = async ({ pageParam = 1 }): Promise<MedOrdersResponse> => {
        const res = await fetch(`/api/admin/GET/med-orders?page=${pageParam}&limit=20`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add token to headers
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch med orders');
        }

        const data = await res.json();
        return data;
    };

    const {
        data,
        isLoading: loadingMedOrders,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useInfiniteQuery<MedOrdersResponse, Error>(
        'medOrders',
        fetchAdminMedOrders,
        {
            getNextPageParam: (lastPage) => {
                return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
            },
        }
    );

    const flattenedMedOrders = data ? data.pages.flatMap(page => page.orders) : [];

    const nextMedOrders = () => {
        if (!loadingMedOrders && hasNextPage) {
            fetchNextPage();
        }
    };

    return {
        medOrders: flattenedMedOrders,
        loadingMedOrders,
        hasMoreMedOrders: hasNextPage,
        nextMedOrders,
        refetchMedOrders: refetch,
    };
}