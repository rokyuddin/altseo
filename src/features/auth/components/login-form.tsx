'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas/auth-schema'
import { login } from '../actions/auth-actions'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card'
import Link from 'next/link'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginInput) => {
    startTransition(async () => {
      const result = await login(data)
      if (result?.error) {
        setError('root', { message: result.error })
      }
    })
  }

  return (
    <Card className="w-full max-w-md bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your email to sign in to your account
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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

          {errors.root?.message && (
             <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
               <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{errors.root.message}</p>
             </div>
           )}

          <Button type="submit" className="w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98]" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
