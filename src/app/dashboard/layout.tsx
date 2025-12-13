import DashboardShell from '@/components/templates/dashboard-shell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
