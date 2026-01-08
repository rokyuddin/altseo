'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '../schemas/contact-schema'
import { submitContactForm } from '../actions/contact-actions'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Textarea } from '@/components/atoms/textarea'
import { Card, CardContent } from '@/components/atoms/card'
import { CheckCircle2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContactForm() {
    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    })

    const onSubmit = (data: ContactInput) => {
        startTransition(async () => {
            const result = await submitContactForm(data)
            if (result?.error) {
                setError('root', { message: result.error })
            } else if (result?.success) {
                setIsSuccess(true)
                reset()
            }
        })
    }

    if (isSuccess) {
        return (
            <Card className="relative flex justify-center items-center bg-card/60 shadow-2xl shadow-primary/5 backdrop-blur-md border-2 border-border/50 rounded-4xl min-h-[400px] overflow-hidden">
                {/* Decorative gradient top border */}
                <div className="top-0 right-0 left-0 absolute bg-linear-to-r from-transparent via-primary/40 to-transparent h-1.5" />

                <CardContent className="flex flex-col justify-center items-center space-y-6 p-8 md:p-10 text-center animate-in duration-500 fade-in zoom-in">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse-slow" />
                        <CheckCircle2 className="z-10 relative w-20 h-20 text-primary" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="font-serif font-bold text-foreground text-3xl tracking-tight">Message Sent!</h2>
                        <p className="mx-auto max-w-sm text-muted-foreground leading-relaxed">
                            Thank you for reaching out. Our team will get back to you as soon as possible.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsSuccess(false)}
                        className="hover:bg-primary/5 px-8 border-2 border-primary/20 rounded-full transition-all"
                    >
                        Send another message
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="relative bg-card/60 shadow-2xl shadow-primary/5 backdrop-blur-md border-2 border-border/50 rounded-4xl overflow-hidden">
            {/* Decorative gradient top border */}
            <div className="top-0 right-0 left-0 absolute bg-linear-to-r from-transparent via-primary/40 to-transparent h-1.5" />

            <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="ml-1 font-semibold text-foreground/80 text-sm">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                disabled={isPending}
                                className={cn(
                                    "bg-background/40 border-2 rounded-2xl h-12 transition-all duration-300",
                                    "focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50",
                                    errors.name && "border-destructive/50"
                                )}
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="ml-1 font-medium text-destructive text-xs">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="ml-1 font-semibold text-foreground/80 text-sm">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                disabled={isPending}
                                className={cn(
                                    "bg-background/40 border-2 rounded-2xl h-12 transition-all duration-300",
                                    "focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50",
                                    errors.email && "border-destructive/50"
                                )}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="ml-1 font-medium text-destructive text-xs">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2.5">
                        <Label htmlFor="subject" className="ml-1 font-semibold text-foreground/80 text-sm">
                            Subject
                        </Label>
                        <Input
                            id="subject"
                            placeholder="How can we help you?"
                            disabled={isPending}
                            className={cn(
                                "bg-background/40 border-2 rounded-2xl h-12 transition-all duration-300",
                                "focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50",
                                errors.subject && "border-destructive/50"
                            )}
                            {...register('subject')}
                        />
                        {errors.subject && (
                            <p className="ml-1 font-medium text-destructive text-xs">
                                {errors.subject.message}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2.5">
                        <Label htmlFor="message" className="ml-1 font-semibold text-foreground/80 text-sm">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us about your project or inquiry..."
                            disabled={isPending}
                            rows={5}
                            className={cn(
                                "bg-background/40 border-2 rounded-2xl min-h-[120px] transition-all duration-300",
                                "focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50",
                                errors.message && "border-destructive/50"
                            )}
                            {...register('message')}
                        />
                        {errors.message && (
                            <p className="ml-1 font-medium text-destructive text-xs">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    {/* Root Errors */}
                    {errors.root?.message && (
                        <div className="bg-destructive/10 slide-in-from-top-2 p-4 border border-destructive/20 rounded-2xl animate-in fade-in">
                            <p className="font-medium text-destructive text-sm text-center">
                                {errors.root.message}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "group relative shadow-xl rounded-2xl w-full h-14 overflow-hidden font-bold text-lg transition-all duration-300",
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                            "hover:scale-[1.01] active:scale-[0.99] shadow-primary/20 hover:shadow-primary/30"
                        )}
                    >
                        {isPending ? (
                            <div className="flex items-center gap-3">
                                <div className="border-3 border-background/20 border-t-background rounded-full w-5 h-5 animate-spin" />
                                <span>Sending...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Send Message</span>
                                <Send className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                            </div>
                        )}

                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
