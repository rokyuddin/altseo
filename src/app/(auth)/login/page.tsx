import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/login-form'

export const metadata: Metadata = {
  title: 'Login | AltSEO - Access Your Image SEO Dashboard',
  description: 'Sign in to AltSEO to manage your automated ALT text generation and image SEO optimization.',
}

export default function LoginPage() {
  return <LoginForm />

}
