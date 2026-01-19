import { useAuthStore } from '@/hooks/use-auth'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/atoms/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import { signOut } from '@/features/auth/actions/auth-actions'
import { useIsMobile } from '@/hooks/use-mobile'
import Link from 'next/link'

export default function AdminSidebarFooter() {
    const { user } = useAuthStore()
    const isMobile = useIsMobile()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >

                            <div className="flex-1 grid text-sm text-left leading-tight">
                                <span className="font-medium truncate">{user?.user_metadata?.full_name}</span>
                                <span className="text-muted-foreground text-xs truncate">
                                    {user?.user_metadata?.email}
                                </span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex-1 grid text-sm text-left leading-tight">
                                <span className="font-medium truncate">{user?.user_metadata?.full_name}</span>
                                <span className="text-muted-foreground text-xs truncate">
                                    {user?.user_metadata?.email}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/admin/settings" className="w-full">
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => await signOut('/admin/login')}>
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
