'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '../schemas/auth-schema'
import { signup } from '../actions/auth-actions'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Card, CardContent, CardFooter } from '@/components/atoms/card'
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
    <div className="slide-in-from-bottom-4 space-y-8 w-full animate-in duration-700 fade-in">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="font-serif font-semibold text-foreground text-3xl tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Start automating your ALT text and accessibility today
        </p>
      </div>

      {/* Form Card - Organic rounded design */}
      <Card className="relative bg-card/80 shadow-primary/5 shadow-xl backdrop-blur-sm border-2 border-border/50 rounded-3xl w-full overflow-hidden">
        {/* Organic accent gradient */}
        <div className="top-0 right-0 left-0 absolute bg-linear-to-r from-transparent via-primary/30 to-transparent h-1" />

        <CardContent className="p-8 pt-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="font-medium text-foreground/90 text-sm">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isPending}
                className="bg-background/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10 border-2 focus:border-primary/50 rounded-2xl h-12 transition-all duration-200"
                {...register('email')}
              />
              {errors.email && (
                <span className="flex items-center gap-1 ml-1 font-medium text-destructive text-xs">
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
                <span className="flex items-center gap-1 ml-1 font-medium text-destructive text-xs">
                  <span>•</span>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword" className="font-medium text-foreground/90 text-sm">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                className="bg-background/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10 border-2 focus:border-primary/50 rounded-2xl h-12 transition-all duration-200"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className="flex items-center gap-1 ml-1 font-medium text-destructive text-xs">
                  <span>•</span>
                  {errors.confirmPassword.message}
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
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center bg-muted/20 px-8 pt-0 pb-8 border-border/30 border-t">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="group inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
              <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Decorative organic element */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          <div className="bg-primary/40 rounded-full w-1.5 h-1.5 animate-pulse" />
          <div className="bg-primary/60 rounded-full w-1.5 h-1.5 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="bg-primary/40 rounded-full w-1.5 h-1.5 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}
