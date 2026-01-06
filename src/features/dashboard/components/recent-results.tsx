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
    <Card className="slide-in-from-bottom-4 flex flex-col gap-0 h-[calc(100svh-44rem)] overflow-hidden animate-in duration-700 fade-in">
      <CardHeader className="pb-6">
        <CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-primary/10 border border-primary/10 rounded-2xl size-10 text-primary">
              <Clock className="size-5" />
            </div>
            Recent activity
          </div>
        </CardTitle>
        <CardAction>
          <Link
            href="/assets/upload"
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
          <Table containerClassName="overflow-visible">
            <TableHeader className="top-0 z-10 sticky bg-card/95 supports-backdrop-filter:bg-card/75 backdrop-blur">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-black text-xs uppercase tracking-widest">Image</TableHead>
                <TableHead className="font-black text-xs uppercase tracking-widest">File Name</TableHead>
                <TableHead className="font-black text-xs uppercase tracking-widest">Alt Text</TableHead>
                <TableHead className="font-black text-xs text-right uppercase tracking-widest">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className="group/row hover:bg-muted/50 border-border transition-colors"
                >
                  <TableCell>
                    <div className="relative shadow-sm ring-border rounded-lg ring-1 w-14 h-14 overflow-hidden group-hover/row:scale-105 transition-transform duration-500">
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
                      <span className="max-w-[180px] font-bold text-foreground group-hover/row:text-primary text-sm truncate transition-colors">
                        {result.file_name}
                      </span>
                      <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-tighter">
                        {result.storage_path.split('.').pop()} file
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {result.alt_text ? (
                      <div className="flex flex-col gap-2">
                        <p className="max-w-sm font-medium text-muted-foreground text-xs italic line-clamp-2 leading-relaxed whitespace-normal">
                          "{result.alt_text}"
                        </p>
                        <div className="flex items-center self-start gap-1.5">
                          <span className="inline-flex items-center gap-1 bg-primary/10 px-2 py-0.5 border border-primary/10 rounded-full font-bold text-[9px] text-primary">
                            <Sparkles className="w-2.5 h-2.5" />
                            Generated
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1 border border-border rounded-full font-bold text-[10px] text-secondary-foreground">
                        <Clock className="w-3 h-3 animate-pulse" />
                        Processing...
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-black tabular-nums text-foreground text-sm">
                        {format(new Date(result.created_at), "MMM d")}
                      </span>
                      <span className="font-medium text-[10px] text-muted-foreground">
                        {format(new Date(result.created_at), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-6 p-20 text-center">
            <div className="flex justify-center items-center bg-muted rounded-3xl w-20 h-20">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-xl">No recent activity</h3>
              <p className="mx-auto mt-2 max-w-[240px] font-light text-muted-foreground text-sm">
                Optimization results will appear here once you upload your first image.
              </p>
            </div>
            <Link
              href="/assets/upload"
              className="inline-flex items-center gap-2 bg-primary shadow-md px-6 py-3 rounded-xl font-bold text-primary-foreground text-sm transition-all hover:-translate-y-1"
            >
              Start Uploading
            </Link>
          </div>
        )}
      </CardContent>

      <Separator />
      <CardFooter className="flex justify-center items-center py-4">
        <Link href="/assets/history" className="font-black text-primary hover:text-primary/80 text-xs uppercase tracking-widest transition-colors">
          View all activity
        </Link>
      </CardFooter>
    </Card>
  );
}

