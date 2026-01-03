import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/auth/get-user";
import { checkRateLimit } from "@/lib/rate-limit";
import { ImageUploader } from "@/features/upload/components/image-uploader";
import { UploadHeader } from "@/features/upload/components/upload-header";
import { HistoryList } from "@/features/upload/components/history-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Upload, History } from "lucide-react";

export default async function UploadPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect("/login");
  }

  const rateLimit = await checkRateLimit(user.id);
  const isPro = profile.plan === "pro";
  const isNearLimit = !isPro && rateLimit.remaining <= 3;
  const isAtLimit = !isPro && rateLimit.remaining === 0;

  return (
    <div className="px-6 py-12 space-y-10 relative z-10 max-w-7xl mx-auto">
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
          <UploadHeader
            isPro={isPro}
            rateLimit={rateLimit}
            isNearLimit={isNearLimit}
            isAtLimit={isAtLimit}
          />
          <ImageUploader allowGuest={false} />
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none">
          <HistoryList userId={user.id} isPro={isPro} />
        </TabsContent>
      </Tabs>
    </div>
  );
}


