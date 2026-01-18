-- Create app_roles table
CREATE TABLE public.app_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create app_permissions table
CREATE TABLE public.app_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create role_permissions join table
CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.app_roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.app_permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Create operators table
CREATE TABLE public.operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role_id UUID REFERENCES public.app_roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create admin_audit_logs table
CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add some default permissions
INSERT INTO public.app_permissions (key, description) VALUES
('manage_operators', 'Can create, update, and revoke operators'),
('manage_users', 'Can manage end users and subscriptions'),
('view_audit_logs', 'Can view admin audit logs'),
('manage_settings', 'Can update platform settings');

-- Add default roles
INSERT INTO public.app_roles (name, description) VALUES
('super_admin', 'Full access to all administrative functions'),
('operator', 'Limited administrative access');

-- Assign all permissions to super_admin
WITH sa_role AS (SELECT id FROM public.app_roles WHERE name = 'super_admin')
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sa_role.id, p.id FROM sa_role, public.app_permissions p;

-- Enable RLS
ALTER TABLE public.app_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for operators (administrators)
-- Note: These policies assume we can identify an operator by their auth_user_id

-- Function to check if the current user is an active operator
CREATE OR REPLACE FUNCTION public.is_operator() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.operators 
    WHERE auth_user_id = auth.uid() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if the current user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission_key TEXT) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.operators op
    JOIN public.role_permissions rp ON op.role_id = rp.role_id
    JOIN public.app_permissions p ON rp.permission_id = p.id
    WHERE op.auth_user_id = auth.uid() 
    AND op.is_active = true
    AND p.key = permission_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow operators to view roles and permissions
CREATE POLICY "Operators can view roles" ON public.app_roles 
    FOR SELECT USING (public.is_operator());

CREATE POLICY "Operators can view permissions" ON public.app_permissions 
    FOR SELECT USING (public.is_operator());

CREATE POLICY "Operators can view role permissions" ON public.role_permissions 
    FOR SELECT USING (public.is_operator());

-- Operators can see other operators
CREATE POLICY "Operators can view operators" ON public.operators 
    FOR SELECT USING (public.is_operator());

-- Only super_admin (or those with manage_operators) can modify operators
CREATE POLICY "Can manage operators" ON public.operators 
    FOR ALL USING (public.has_permission('manage_operators'));

-- Audit logs are viewable by those with view_audit_logs
CREATE POLICY "Can view audit logs" ON public.admin_audit_logs 
    FOR SELECT USING (public.has_permission('view_audit_logs'));
