'use client'

import { Input } from "@/components/atoms/input"
import { History, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function HistoryHeader() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="flex md:flex-row flex-col justify-between items-start gap-8 pb-4">
            <div className="space-y-4">
                <div className="flex items-center gap-3 slide-in-from-left-4 text-primary animate-in duration-500 fade-in">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <History className="w-5 h-5" />
                    </div>
                    <span className="opacity-70 font-bold text-sm uppercase tracking-widest">
                        Archives & Logs
                    </span>
                </div>
                <h1 className="slide-in-from-left-6 font-black text-foreground text-5xl md:text-6xl tracking-tight animate-in duration-700 fade-in">
                    Asset <span className="text-primary/90">History</span>
                </h1>
                <p className="slide-in-from-left-8 max-w-2xl font-medium text-muted-foreground text-xl leading-relaxed animate-in duration-1000 fade-in">
                    Manage and view your generated assets with advanced filtering capabilities.
                </p>
            </div>

            <div className="slide-in-from-right-4 relative bg-card rounded-2xl w-full md:w-96 animate-in duration-700 fade-in">
                <Search className="top-1/2 left-4 absolute w-5 h-5 text-muted-foreground -translate-y-1/2 pointer-events-none" />
                <Input
                    placeholder="Search assets..."
                    className="shadow-stone-200/20 shadow-xl backdrop-blur-sm py-6 pl-11 border-stone-200/60 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/20 w-full font-medium text-base transition-all"
                    defaultValue={searchParams.get('q')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
        </div>
    )
}
