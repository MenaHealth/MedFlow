import { useInfiniteQuery } from 'react-query';

export interface Medication {
    diagnosis: string;
    medication: string;
    dosage: string;
    frequency: string;
    quantity: string;
}

export interface IMedOrder {
    _id: string;
    patientName: string;
    patientId: string;
    patientCity: string;
    patientCountry: string;
    medications: Medication[];
    orderDate: string;
    prescribingDr: string;
    doctorSpecialty: string;
    drEmail: string;
    patientPhone: string;
    validated: boolean;
    drId: string;
    // Add any other properties that are part of IMedOrder but not in MedOrder
}

interface MedOrdersResponse {
    orders: IMedOrder[];
    totalPages: number;
    currentPage: number;
}

export function useMedOrdersViewModel() {
    const fetchMedOrders = async ({ pageParam = 1 }): Promise<MedOrdersResponse> => {
        // console.log(`Fetching Med Orders from page ${pageParam}`);
        const res = await fetch(`/api/admin/GET/med-orders?page=${pageParam}&limit=20`);
        if (!res.ok) {
            // console.error('Failed to fetch med orders');
            throw new Error('Failed to fetch med orders');
        }
        const data = await res.json();
        // console.log('Fetched Med Orders Data:', data);
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
        fetchMedOrders,
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