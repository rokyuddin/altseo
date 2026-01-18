import type { Metadata } from 'next'
import { AdminLoginForm } from '@/features/auth/components/admin-login-form'
import AuthLayout from '@/components/templates/auth-layout'

export const metadata: Metadata = {
  title: 'Admin Login | AltSEO Console',
  description: 'Secure access for AltSEO platform operators and administrators.',
}

export default function AdminLoginPage() {
  return (
    <AuthLayout>
        <AdminLoginForm />
    </AuthLayout>
  )
}
