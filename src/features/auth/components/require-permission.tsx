'use client';

import React from 'react';
import { type PermissionKey, hasPermission } from '@/lib/permissions-types';
// import { useAuth } from '@/components/providers/auth-provider';
import { useAuthStore } from '@/hooks/use-auth';

interface RequirePermissionProps {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A wrapper component that only renders its children if the user has the required permission.
 */
export function RequirePermission({
  permission,
  children,
  fallback = null,
}: RequirePermissionProps) {

  const { isLoading, permissions, isOperator } = useAuthStore()

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isOperator || !hasPermission(permissions, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
