"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/atoms/breadcrumb'
import { Separator } from '@/components/atoms/separator'
import { SidebarTrigger } from '@/components/atoms/sidebar'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function AdminHeader() {
    const pathname = usePathname()
    // Skip the first empty string and 'admin' if present to avoid duplication with the hardcoded "Admin Panel" home set
    const pathSegments = pathname.split('/').filter(segment => segment !== '' && segment !== 'admin')

    return (
        <header className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 border-b h-16 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 transition-[width,height] ease-linear shrink-0">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                        </BreadcrumbItem>
                        {pathSegments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                        {pathSegments.map((segment, index) => {
                            const href = `/admin/${pathSegments.slice(0, index + 1).join('/')}`
                            const isLast = index === pathSegments.length - 1
                            const formattedSegment = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

                            return (
                                <React.Fragment key={href}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}
