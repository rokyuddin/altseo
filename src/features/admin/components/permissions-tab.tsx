import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";
import { PermissionActions } from "./permisson-actions";
import AddPermission from "./add-permission";
import { getPermissions } from "../actions/permissions-actions";
import { use } from "react";


export function PermissionsTab() {
    const permissions = use(getPermissions())


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">System Permissions</h3>
                <AddPermission />
            </div>

            <div className="bg-card border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Permission Key</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    No permissions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            permissions.map((perm) => (
                                <TableRow key={perm.id}>
                                    <TableCell className="font-mono">{perm.key}</TableCell>
                                    <TableCell className="text-right">
                                        <PermissionActions permission={perm} />
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
