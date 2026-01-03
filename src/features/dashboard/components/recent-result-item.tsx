
"use client"

import { format } from "date-fns";
import { Calendar, Sparkles, MoveRight } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface RecentResultItemProps {
  result: {
    id: string;
    file_name: string;
    created_at: string;
    alt_text: string | null;
    storage_path: string;
  };
}

export function RecentResultItem({ result }: RecentResultItemProps) {
  const supabase = createClient();
  
  const getImageUrl = (path: string) => {
    if (path.startsWith('blob:') || path.startsWith('data:')) return path;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="group relative bg-white/40 backdrop-blur-xl dark:bg-card/20 rounded-4xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-border/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-1.5 flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={getImageUrl(result.storage_path)}
          alt={result.file_name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
           <div className="flex items-center gap-2 text-white text-xs font-semibold">
             <span>View details</span>
             <MoveRight className="w-3 h-3" />
           </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {result.file_name}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium tracking-tight uppercase">
                <Calendar className="h-3 w-3" />
                {format(new Date(result.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
        
        {result.alt_text && (
          <div className="flex-1 rounded-2xl bg-stone-50/50 dark:bg-stone-900/30 p-4 border border-stone-100/50 dark:border-stone-800/50 group-hover:border-primary/20 transition-colors">
            <p className="line-clamp-3 text-xs text-muted-foreground leading-relaxed font-light italic">
              "{result.alt_text}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
