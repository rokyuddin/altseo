export type PermissionKey =
  | 'manage_operators'
  | 'manage_users'
  | 'view_audit_logs'
  | 'manage_settings';

export interface OperatorMetadata {
  role: string;
  permissions: PermissionKey[];
  isActive: boolean;
}

/**
 * Checks if the user has a specific permission.
 */
export function hasPermission(permissions: PermissionKey[], key: PermissionKey): boolean {
  return permissions.includes(key);
}
