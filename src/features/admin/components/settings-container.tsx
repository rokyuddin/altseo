import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { ProfileTab } from "./profile-tab";
import { LayoutDashboard, Key, Shield } from "lucide-react";
import { PermissionsTab } from "./permissions-tab";
import { use } from "react";
import { getOperatorMetadataServer } from "@/lib/permissions-server";
import { RolesTab } from "./roles-tab";

export function SettingsContainer() {
    const user = use(getOperatorMetadataServer());
    const isSuperAdmin = user?.role === 'super_admin';

    return (
        < Tabs defaultValue="profile" className="w-full" >
            <TabsList className="mb-8 w-fit">
                <TabsTrigger value="profile">
                    <LayoutDashboard className="mr-2 w-4 h-4" />
                    Profile
                </TabsTrigger>
                {isSuperAdmin && (
                    <>
                        <TabsTrigger value="permissions">
                            <Key className="mr-2 w-4 h-4" />
                            Permissions
                        </TabsTrigger>
                        <TabsTrigger value="roles">
                            <Shield className="mr-2 w-4 h-4" />
                            Roles
                        </TabsTrigger>
                    </>
                )}
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
                <ProfileTab />
            </TabsContent>

            {isSuperAdmin && (
                <>
                    <TabsContent value="permissions" className="space-y-4">
                        <PermissionsTab />
                    </TabsContent>
                    <TabsContent value="roles" className="space-y-4">
                        <RolesTab />
                    </TabsContent>
                </>
            )}
        </Tabs >
    );
}
