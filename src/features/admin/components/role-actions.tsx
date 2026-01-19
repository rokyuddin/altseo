"use client"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/atoms/alert-dialog'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/atoms/dialog';
import { Input } from '@/components/atoms/input';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react'
import { deleteRole, Role, updateRole } from '../actions/roles-actions';

export function RoleActions({ role }: { role: Role }) {
    return (
        <div className="flex justify-end gap-2">
            <EditRoleDialog role={role} />
            <DeleteRoleAlert role={role} />
        </div>
    )
}





function EditRoleDialog({ role }: { role: Role }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editKey, setEditKey] = useState(role.name);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        if (!editKey.trim()) return;
        setIsSubmitting(true);
        const result = await updateRole(role.id, editKey.trim());
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
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Update the role name.
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


function DeleteRoleAlert({ role }: { role: Role }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleDelete = async () => {
        setIsSubmitting(true);
        const result = await deleteRole(role.id);
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
                    <AlertDialogTitle>Delete Role?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the role <b>{role.name}</b>.
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