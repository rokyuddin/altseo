"use client"
import { Button } from '@/components/atoms/button';
import { useApiKeysStore } from '../store/api-keys-store';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/atoms/alert-dialog";

export default function ApiKeyRevokeBtn({ id }: { id: string }) {
    const { revokingId, revokeKey } = useApiKeysStore();
    const isRevoking = revokingId === id;

    const handleRevoke = () => revokeKey(id);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 p-0 w-8 h-8 text-red-600 hover:text-red-700"
                    disabled={isRevoking}
                >
                    {isRevoking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                    <span className="sr-only">Revoke</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 mb-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently revoke the API key.
                        Any applications using this key will immediately lose access to the API.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRevoke}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        Revoke Key
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
