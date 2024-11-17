// components/hooks/useApi.ts
import { useMemo } from 'react';
import { createApiWrapper } from '@/utils/apiWrapper';
import { useToast } from '@/components/hooks/useToast';

export const useApi = () => {
    const { setToast } = useToast();

    const api = useMemo(() => createApiWrapper(setToast), [setToast]);

    return api;
};