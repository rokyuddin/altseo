"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createRole } from '../actions/roles-actions';

export default function AddRole() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleCreate = async () => {
        if (!newKey.trim()) return;
        setIsSubmitting(true);
        const result = await createRole(newKey.trim());
        setIsSubmitting(false);

        if (result.error) {
            alert(`Error: ${result.error}`); // Use proper toast if available
        } else {
            setNewKey("");
            setIsAddOpen(false);
        }
    };

    return (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> Add Role
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                        Create a new role name. Use snake_case format (e.g. 'admin').
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="role_name"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
