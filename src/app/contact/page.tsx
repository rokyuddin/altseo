import type { Metadata } from 'next'
import { Suspense } from "react";
import { HomeHeader } from "@/components/organisms/home-header";
import Footer from "@/components/organisms/footer";
import HomeHeaderSkeleton from "@/components/organisms/home-header-skeleton";
import { ContactForm } from '@/features/contact'
import { Globe, ArrowRight } from 'lucide-react'
import { contactInfo } from '@/features/contact';

export const metadata: Metadata = {
    title: 'Contact Us | AltSEO - Get in Touch',
    description: 'Have questions about AltSEO? Reach out to our team for support, partnerships, or just to say hello. We are here to help you optimize your image SEO.',
}



export default function ContactPage() {
    return (
        <div className="flex flex-col bg-background selection:bg-primary/20 min-h-svh overflow-x-hidden font-sans text-foreground transition-colors duration-500">
            <Suspense fallback={<HomeHeaderSkeleton />} >
                <HomeHeader />
            </Suspense>

            <main className="container-inline-size relative flex flex-1 justify-center items-center">
                {/* Background Decorative Elements */}
                <div className="top-0 left-1/4 absolute bg-primary/5 blur-[120px] rounded-full w-[500px] h-[500px] -translate-y-1/2 pointer-events-none" />
                <div className="right-1/4 bottom-0 absolute bg-accent/5 blur-[100px] rounded-full w-[400px] h-[400px] translate-y-1/2 pointer-events-none" />

                <div className="z-10 relative mx-auto max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
                    <div className="items-start gap-16 grid grid-cols-1 lg:grid-cols-2">

                        {/* Left Column: Content */}
                        <div className="slide-in-from-bottom-4 space-y-12 animate-in duration-700">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 border border-primary/20 rounded-full font-bold text-primary text-sm uppercase tracking-wider">
                                    <Globe className="w-4 h-4" />
                                    Connect With Us
                                </div>
                                <h1 className="font-serif font-bold text-foreground text-5xl md:text-6xl leading-[1.1] tracking-tight">
                                    Let's talk about your <span className="text-primary italic">Image SEO</span>
                                </h1>
                                <p className="max-w-xl text-muted-foreground text-xl leading-relaxed">
                                    Have a specific question or just want to learn more about how AltSEO can transform your accessibility and rankings? We'd love to hear from you.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="gap-6 grid grid-cols-1">
                                {contactInfo.map((info, index) => (
                                    <a
                                        key={info.title}
                                        href={info.href}
                                        className="group flex items-start gap-5 bg-card/40 hover:bg-card/60 p-6 border border-border/50 hover:border-primary/30 rounded-3xl transition-all duration-300"
                                    >
                                        <div className="flex justify-center items-center bg-primary/10 rounded-2xl w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300">
                                            <info.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-foreground text-lg">{info.title}</h3>
                                            <p className="text-muted-foreground text-sm">{info.description}</p>
                                            <div className="flex items-center gap-2 pt-2 font-semibold text-primary">
                                                {info.value}
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="slide-in-from-bottom-4 relative animate-in duration-1000 delay-200">
                            {/* Outer decorative ring */}
                            <div className="absolute -inset-4 border border-primary/5 rounded-[2.5rem] animate-pulse-slow pointer-events-none" />
                            <ContactForm />
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
