import { Suspense } from "react";
import { BookOpen, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { ApiKeysHeader } from "./api-keys-header";
import { ApiKeysList } from "./api-keys-list";
import { NewKeyDisplay } from "./new-key-display";
import { SecurityNotice } from "./security-notice";
import { ApiDocs } from "./api-docs";
import { ApiKeysListLoader } from "./api-keys-list-loader";

export function ApiKeysManager() {
    return (
        <div className="slide-in-from-bottom-4 space-y-8 animate-in duration-500 fade-in">
            <ApiKeysHeader />

            <Tabs defaultValue="keys" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="keys" className="gap-2">
                        <Key className="w-4 h-4" />
                        Manage Keys
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="gap-2">
                        <BookOpen className="w-4 h-4" />
                        Documentation
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="keys" className="space-y-8 outline-none">
                    <NewKeyDisplay />
                    <Suspense fallback={<ApiKeysListLoader />}>
                        <ApiKeysList />
                    </Suspense>
                    <SecurityNotice />
                </TabsContent>

                <TabsContent value="docs">
                    <ApiDocs />
                </TabsContent>
            </Tabs>
        </div>
    );
}
