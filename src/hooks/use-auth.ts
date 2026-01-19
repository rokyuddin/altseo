import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { type User, type Session } from '@supabase/supabase-js';
import { getOperatorMetadataClient } from '@/lib/permissions-client';
import { type PermissionKey } from '@/lib/permissions-types';

interface AuthState {
    user: User | null;
    session: Session | null;
    role: string | null;
    permissions: PermissionKey[];
    isLoading: boolean;
    isAuthenticated: boolean;
    isOperator: boolean;
    isInitialized: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setRole: (role: string | null) => void;
    setPermissions: (permissions: PermissionKey[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    fetchOperatorInfo: () => Promise<void>;
    initialize: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    role: null,
    permissions: [],
    isLoading: true,
    isAuthenticated: false,
    isOperator: false,
    isInitialized: false,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user
    }),

    setSession: (session) => set({ session }),

    setRole: (role) => set({
        role,
        isOperator: !!role
    }),

    setPermissions: (permissions) => set({ permissions }),

    setIsLoading: (isLoading) => set({ isLoading }),

    fetchOperatorInfo: async () => {
        const meta = await getOperatorMetadataClient();

        if (meta) {
            set({
                role: meta.role,
                permissions: meta.permissions,
                isOperator: true
            });
        } else {
            set({
                role: null,
                permissions: [],
                isOperator: false
            });
        }
    },

    initialize: async () => {
        if (get().isInitialized) return;

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session?.user
        });

        if (session?.user) {
            await get().fetchOperatorInfo();
        }

        set({ isLoading: false, isInitialized: true });

        // Set up auth state listener
        supabase.auth.onAuthStateChange(async (event, session) => {
            set({
                session,
                user: session?.user ?? null,
                isAuthenticated: !!session?.user
            });

            if (session?.user) {
                await get().fetchOperatorInfo();
            } else {
                set({
                    role: null,
                    permissions: [],
                    isOperator: false
                });
            }

            set({ isLoading: false });
        });
    },

    reset: () => set({
        user: null,
        session: null,
        role: null,
        permissions: [],
        isLoading: false,
        isAuthenticated: false,
        isOperator: false,
    }),
}));