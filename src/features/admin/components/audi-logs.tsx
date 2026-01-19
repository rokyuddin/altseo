import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card";
import { use } from "react";
import { getAuditLogs } from "@/features/admin/api";

export function AuditLogs() {
    const logs = use(getAuditLogs())

    return (
        <div className="slide-in-from-bottom-4 flex flex-col flex-1 space-y-8 overflow-y-auto animate-in duration-700 fade-in">
            <div>
                <h1 className="font-bold text-3xl tracking-tight">
                    Audit Logs
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Traceable record of all administrative actions performed on the platform.
                </p>
            </div>

            <Card className="flex flex-col flex-1 bg-card/50 backdrop-blur-sm border-border/50 overflow-y-auto">
                <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>
                        The most recent 50 administrative actions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-mono text-sm whitespace-nowrap">
                                            {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                                        </TableCell>
                                        <TableCell className="font-medium text-sm capitalize">
                                            {log.action.replace('_', ' ')}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            <pre className="max-w-md overflow-hidden text-[10px] whitespace-pre-wrap">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
