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