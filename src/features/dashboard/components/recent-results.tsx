
"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Upload as UploadIcon, ImageIcon, ArrowRight, Search, Filter } from "lucide-react";
import { RecentResultItem } from "./recent-result-item";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/tabs";
import { Input } from "@/components/atoms/input";

interface Result {
  id: string;
  file_name: string;
  created_at: string;
  alt_text: string | null;
  storage_path: string;
}

interface RecentResultsProps {
  results: Result[] | null;
}

export function RecentResults({ results }: RecentResultsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab ] = useState("all");

  const filteredResults = useMemo(() => {
    if (!results) return [];
    
    let filtered = results;
    
    if (searchQuery) {
      filtered = filtered.filter(res => 
        res.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeTab === "with-alt") {
      filtered = filtered.filter(res => !!res.alt_text);
    } else if (activeTab === "processing") {
      filtered = filtered.filter(res => !res.alt_text);
    }

    return filtered;
  }, [results, searchQuery, activeTab]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Gallery
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              Manage your generated content and history.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search images..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 w-full sm:w-64 rounded-2xl bg-white/50 backdrop-blur-md border-white/60 focus:bg-white transition-all shadow-xs focus:shadow-md"
            />
          </div>
          <Link
            href="/upload"
            className="group hidden sm:inline-flex items-center gap-2 rounded-2xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 shadow-xl hover:-translate-y-0.5"
          >
            <UploadIcon className="h-4 w-4" />
            <span>New Upload</span>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-white/40 backdrop-blur-md border-white/60 rounded-2xl p-1 shadow-xs">
            <TabsTrigger value="all" className="rounded-xl px-5 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              All Results
            </TabsTrigger>
            <TabsTrigger value="with-alt" className="rounded-xl px-5 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Completed
            </TabsTrigger>
            <TabsTrigger value="processing" className="rounded-xl px-5 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Pending
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pr-2">
            <Filter className="w-3 h-3" />
            Showing {filteredResults.length} items
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-8">
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResults.map((result) => (
                <RecentResultItem key={result.id} result={result} />
              ))}
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-xl dark:bg-card/20 rounded-4xl p-12 md:p-24 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-border/30 relative overflow-hidden group min-h-[400px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10">
                <div className="mx-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-4xl bg-primary/5 mb-8">
                  <ImageIcon className="h-10 w-10 md:h-12 md:w-12 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {searchQuery ? "No matches found" : "Your gallery is empty"}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed font-light">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "Start your journey by uploading an image. Our AI will handle the rest."}
                </p>
                {!searchQuery && (
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
                  >
                    <UploadIcon className="h-5 w-5" />
                    Upload Image
                  </Link>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
