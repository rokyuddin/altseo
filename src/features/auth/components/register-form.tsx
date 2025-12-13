'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '../schemas/auth-schema'
import { signup } from '../actions/auth-actions'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card'
import Link from 'next/link'

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: RegisterInput) => {
    startTransition(async () => {
      const result = await signup(data)
      if (result?.error) {
        setError('root', { message: result.error })
      }
    })
  }

  return (
    <Card className="w-full max-w-md bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isPending}
              className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 focus:ring-zinc-500/20 transition-all font-medium"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isPending}
              className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 focus:ring-zinc-500/20 transition-all font-medium"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</span>
            )}
          </div>
          <div className="space-y-2">
             <Label htmlFor="confirmPassword">Confirm Password</Label>
             <Input
               id="confirmPassword"
               type="password"
               disabled={isPending}
               className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 focus:ring-zinc-500/20 transition-all font-medium"
               {...register('confirmPassword')}
             />
             {errors.confirmPassword && (
               <span className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword.message}</span>
             )}
          </div>

          {errors.root?.message && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
              <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{errors.root.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98]" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
