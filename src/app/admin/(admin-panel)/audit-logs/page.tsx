import { createAdminClient } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs | AltSEO Admin",
  description: "Track administrative activities on the platform.",
};
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

async function getAuditLogs() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
  return data;
}

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Audit Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          Traceable record of all administrative actions performed on the platform.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>
            The most recent 50 administrative actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
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
                      <TableCell className="text-sm font-mono whitespace-nowrap">
                        {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell className="text-sm font-medium capitalize">
                        {log.action.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <pre className="text-[10px] whitespace-pre-wrap max-w-md overflow-hidden">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
