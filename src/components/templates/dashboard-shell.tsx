import { Sidebar } from '@/components/organisms/sidebar'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
            {children}
        </main>
      </div>
    </div>
  )
}
