import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata: Metadata = {
  title: 'Sign Up | AltSEO - Automate Your Image Metadata',
  description: 'Create an account on AltSEO to start automating your ALT text generation and improving your web accessibility.',
}

export default function RegisterPage() {
  return <RegisterForm />
}
