'use client';

import { useAuthStore } from '@/hooks/use-auth';
import { useEffect } from 'react';

export function AuthStoreInitializer() {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return null;
}