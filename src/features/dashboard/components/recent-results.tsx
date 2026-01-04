import Link from "next/link";
import Image from "next/image";
import { Sparkles, Upload as UploadIcon, ImageIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Button } from "@/components/atoms/button";
import { getImageUrl } from "@/lib/get-image-url";
import { getRecentResults } from "../lib";
import { use } from "react";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";



export function RecentResults() {
  const results = use(getRecentResults())

  return (
    <Card className="h-[calc(100svh-44rem)] flex flex-col gap-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="pb-6">
        <CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/10">
              <Clock className="size-5" />
            </div>
            Recent activity
          </div>
        </CardTitle>
        <CardAction>
          <Link
            href="/upload"
          >
            <Button>
              <UploadIcon className="size-5" />
              <span>New Upload</span>
            </Button>
          </Link>

        </CardAction>

      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        {results && results.length > 0 ? (
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-xs font-black uppercase tracking-widest">Image</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest">File Name</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest">Alt Text</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className="group/row hover:bg-muted/50 transition-colors border-border"
                >
                  <TableCell>
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden shadow-sm ring-1 ring-border group-hover/row:scale-105 transition-transform duration-500">
                      <Image
                        src={getImageUrl(result.storage_path)}
                        alt={result.file_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-foreground group-hover/row:text-primary transition-colors truncate max-w-[180px]">
                        {result.file_name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                        {result.storage_path.split('.').pop()} file
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {result.alt_text ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground line-clamp-2 italic font-medium leading-relaxed max-w-sm whitespace-normal">
                          "{result.alt_text}"
                        </p>
                        <div className="flex items-center gap-1.5 self-start">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-bold text-primary border border-primary/10">
                            <Sparkles className="w-2.5 h-2.5" />
                            Generated
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground border border-border">
                        <Clock className="w-3 h-3 animate-pulse" />
                        Processing...
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-black text-foreground tabular-nums">
                        {format(new Date(result.created_at), "MMM d")}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {format(new Date(result.created_at), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">No recent activity</h3>
              <p className="text-sm text-muted-foreground font-light max-w-[240px] mx-auto mt-2">
                Optimization results will appear here once you upload your first image.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all shadow-md hover:-translate-y-1"
            >
              Start Uploading
            </Link>
          </div>
        )}
      </CardContent>

      <Separator />
      <CardFooter className="py-4 flex items-center justify-center">
        <Link href="/upload?tab=history" className="text-xs tracking-widest font-black uppercase text-primary hover:text-primary/80 transition-colors">
          View all activity
        </Link>
      </CardFooter>
    </Card>
  );
}

