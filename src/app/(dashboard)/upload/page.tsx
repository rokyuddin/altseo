import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { ImageUploader, UploadHeader, UploadHeaderLoader } from "@/features/upload";
import { Upload, History } from "lucide-react";
import { Suspense } from "react";

export default function UploadPage() {

  return (
    <div className="contain-inline-size">
      <Tabs defaultValue="upload" className="w-full space-y-12">
        <div className="flex justify-center">
          <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/60 shadow-sm h-14 w-full max-w-md">
            <TabsTrigger
              value="upload"
              className="rounded-full px-8 data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 text-base font-bold flex-1 h-full"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-full px-8 data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 text-base font-bold flex-1 h-full"
            >
              <History className="mr-2 h-5 w-5" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upload" className="mt-0 outline-none space-y-10">
          <Suspense fallback={<UploadHeaderLoader />}>
            <UploadHeader />
          </Suspense>
          <ImageUploader allowGuest={false} />
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none">
          {/* <HistoryList /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}


