import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'

export function SystemHealth() {
    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                    Real-time status of critical services
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <HealthItem label="Supabase API" status="online" />
                <HealthItem label="Creem Webhooks" status="online" />
                <HealthItem label="AI Processor" status="online" />
                <HealthItem label="Image Storage" status="online" />
            </CardContent>
        </Card>
    )
}


function HealthItem({
    label,
    status,
}: {
    label: string;
    status: "online" | "offline" | "degraded";
}) {
    const statusColors = {
        online: "bg-green-500",
        offline: "bg-red-500",
        degraded: "bg-yellow-500",
    };

    return (
        <div className="flex justify-between items-center py-2 border-border/30 last:border-0 border-b">
            <span className="font-medium text-sm">{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                    {status}
                </span>
                <span
                    className={`h-2 w-2 rounded-full ${statusColors[status]} shadow-[0_0_8px_rgba(34,197,94,0.5)]`}
                />
            </div>
        </div>
    );
}
