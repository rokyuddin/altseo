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
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Start your journey with us today
        </p>
      </div>

      {/* Form Card - Organic rounded design */}
      <Card className="w-full border-2 border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl overflow-hidden relative">
        {/* Organic accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <CardContent className="p-8 pt-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/90">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isPending}
                className="h-12 rounded-2xl border-2 bg-background/50 transition-all duration-200 focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-xs text-destructive font-medium ml-1 flex items-center gap-1">
                  <span>•</span>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/90">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                className="h-12 rounded-2xl border-2 bg-background/50 transition-all duration-200 focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                {...register('password')}
              />
              {errors.password && (
                <span className="text-xs text-destructive font-medium ml-1 flex items-center gap-1">
                  <span>•</span>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/90">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                className="h-12 rounded-2xl border-2 bg-background/50 transition-all duration-200 focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-destructive font-medium ml-1 flex items-center gap-1">
                  <span>•</span>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {errors.root?.message && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 backdrop-blur-sm">
                <p className="text-sm text-destructive text-center font-medium">
                  {errors.root.message}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-2xl font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-0 justify-center border-t border-border/30 bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
            >
              Sign in
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Decorative organic element */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}
