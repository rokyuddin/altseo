import { Shield } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card";

export function SecurityNotice() {
    return (
        <Card className="bg-muted/50 dark:bg-muted/10">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-base">Security Best Practices</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
                    <li>Never share your API keys publicly or commit them to version control.</li>
                    <li>Store keys securely using environment variables or a secrets manager.</li>
                    <li>Revoke keys immediately if you suspect they have been compromised.</li>
                    <li>Use distinct keys for development, staging, and production environments.</li>
                </ul>
            </CardContent>
        </Card>
    );
}
