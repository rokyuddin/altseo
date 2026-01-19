'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User, type Session } from '@supabase/supabase-js';
import { getOperatorMetadataClient } from '@/lib/permissions-client';
import { type PermissionKey } from '@/lib/permissions-types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  permissions: PermissionKey[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchOperatorInfo = async (userId: string) => {
    const meta = await getOperatorMetadataClient(userId);
    console.log(meta)
    if (meta) {
      setRole(meta.role);
      setPermissions(meta.permissions);
    } else {
      setRole(null);
      setPermissions([]);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchOperatorInfo(session.user.id);
      }

      setIsLoading(false);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchOperatorInfo(session.user.id);
        } else {
          setRole(null);
          setPermissions([]);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    role,
    permissions,
    isLoading,
    isAuthenticated: !!user,
    isOperator: !!role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
