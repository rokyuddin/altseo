"use client"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/atoms/alert-dialog'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/atoms/dialog';
import { Input } from '@/components/atoms/input';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react'
import { deletePermission, Permission, updatePermission } from '../actions/permissions-actions';

export function PermissionActions({ permission }: { permission: Permission }) {
    return (
        <div className="flex justify-end gap-2">
            <EditPermissionDialog permission={permission} />
            <DeletePermissionAlert permission={permission} />
        </div>
    )
}





function EditPermissionDialog({ permission }: { permission: Permission }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editKey, setEditKey] = useState(permission.key);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        if (!editKey.trim()) return;
        setIsSubmitting(true);
        const result = await updatePermission(permission.id, editKey.trim());
        setIsSubmitting(false);

        if (result.error) {
            alert(`Error: ${result.error}`);
        } else {
            setIsEditOpen(false);
        }
    };


    return (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant={'ghost'}>
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Permission</DialogTitle>
                    <DialogDescription>
                        Update the permission key.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                        placeholder="permission_key"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function DeletePermissionAlert({ permission }: { permission: Permission }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleDelete = async () => {
        setIsSubmitting(true);
        const result = await deletePermission(permission.id);
        setIsSubmitting(false);

        if (result.error) {
            alert(`Error: ${result.error}`);
        } else {
            setOpen(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Permission?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the permission <b>{permission.key}</b>.
                        This might affect roles and users relying on it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}