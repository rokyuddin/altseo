'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas/auth-schema'
import { adminLogin } from '../actions/auth-actions'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Card, CardContent, CardFooter } from '@/components/atoms/card'
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export function AdminLoginForm() {
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
      const result = await adminLogin(data)
      if (result?.error) {
        setError('root', { message: result.error })
      }
    })
  }

  return (
    <div className="slide-in-from-bottom-4 space-y-8 w-full animate-in duration-700 fade-in">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary">
            <ShieldCheck className="w-10 h-10" />
          </div>
        </div>
        <h1 className="font-serif font-semibold text-foreground text-3xl tracking-tight">
          Operator Console
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Secure administrative access for platform operators
        </p>
      </div>

      {/* Form Card */}
      <Card className="relative bg-card/80 shadow-primary/5 shadow-xl backdrop-blur-sm border-2 border-border/50 rounded-3xl w-full overflow-hidden">
        <div className="top-0 right-0 left-0 absolute bg-linear-to-r from-transparent via-primary/40 to-transparent h-1" />

        <CardContent className="p-8 pt-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="font-medium text-foreground/90 text-sm">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@altseo.com"
                disabled={isPending}
                className="bg-background/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10 border-2 focus:border-primary/50 rounded-2xl h-12 transition-all duration-200"
                {...register('email')}
              />
              {errors.email && (
                <span className="flex items-center gap-1 mt-1 ml-1 font-medium text-destructive text-xs">
                  <span>•</span>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="font-medium text-foreground/90 text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                className="bg-background/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10 border-2 focus:border-primary/50 rounded-2xl h-12 transition-all duration-200"
                {...register('password')}
              />
              {errors.password && (
                <span className="flex items-center gap-1 mt-1 ml-1 font-medium text-destructive text-xs">
                  <span>•</span>
                  {errors.password.message}
                </span>
              )}
            </div>

            {errors.root?.message && (
              <div className="bg-destructive/10 backdrop-blur-sm p-4 border border-destructive/20 rounded-2xl">
                <p className="font-medium text-destructive text-sm text-center">
                  {errors.root.message}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:shadow-xl rounded-2xl w-full h-12 font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              disabled={isPending}
            >
              {isPending ? 'Authenticating...' : 'Sign in to Console'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center bg-muted/20 px-8 pt-6 pb-8 border-border/30 border-t">
          <Link
            href="/login"
            className="font-medium text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            ← Back to standard login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
