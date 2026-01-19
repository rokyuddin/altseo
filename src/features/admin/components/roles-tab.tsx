import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";
import { use } from "react";
import { getRoles } from "../api";
import { RoleActions } from "./role-actions";
import AddRole from "./add-role";


export function RolesTab() {
    const roles = use(getRoles())


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Roles</h3>
                <AddRole />
            </div>

            <div className="bg-card border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    No roles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-mono">{role.name}</TableCell>
                                    <TableCell className="text-right">
                                        <RoleActions role={role} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
}
