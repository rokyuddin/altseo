'use client';

import React from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { type PermissionKey, hasPermission } from '@/lib/permissions-types';

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
  fallback = null 
}: RequirePermissionProps) {
  const { permissions, isLoading, isOperator } = useAuth();

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  if (!isOperator || !hasPermission(permissions, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
