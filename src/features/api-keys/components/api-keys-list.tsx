import { format } from "date-fns";
import { Check, Key } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";
import { getApiKeys } from "../api";
import GenerateKeyBtn from "./generate-key-btn";
import ApiKeyRevokeBtn from "./api-key-revoke-btn";
import { use } from "react";

export function ApiKeysList() {
    const keys = use(getApiKeys())

    return (
        <Card>
            <CardHeader>
                <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle>Your API Keys</CardTitle>
                        <CardDescription>
                            You have used {keys.length} API keys.
                        </CardDescription>
                    </div>
                    <GenerateKeyBtn />
                </div>
            </CardHeader>
            <CardContent>
                {keys.length > 0 ? (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-mono text-xs">
                                            {key.name || "altseo_••••••••••••••••"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {format(new Date(key.created_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {key.last_used_at ? (
                                                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                                    <Check className="w-3.5 h-3.5" />
                                                    {format(new Date(key.last_used_at), "MMM d, yyyy")}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/60 italic">
                                                    Never used
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ApiKeyRevokeBtn id={key.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center py-10 text-center">
                        <div className="bg-muted mb-4 p-4 rounded-full">
                            <Key className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">No API keys yet</h3>
                        <p className="mt-2 mb-6 max-w-sm text-muted-foreground text-sm">
                            Create an API key to start integrating your applications with our services.
                        </p>
                        <GenerateKeyBtn />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
