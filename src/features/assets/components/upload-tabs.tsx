"use client"
import { Tabs, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { History, Upload } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';

export default function UploadTabs() {
    const router = useRouter()
    const params = useParams()
    const tab = (params.tab as string) || 'upload';

    const handleTabChange = (tab: string) => {
        router.push(`/assets/${tab}`)
    }

    return (
        <Tabs value={tab} onValueChange={handleTabChange} className="space-y-12 w-full">
            <div className="flex justify-center">
                <TabsList className="w-full max-w-md h-12">
                    <TabsTrigger
                        value="upload"
                    >
                        <Upload className="size-5" />
                        Upload
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                    >
                        <History className="size-5" />
                        History
                    </TabsTrigger>
                </TabsList>
            </div>
        </Tabs>
    )
}
