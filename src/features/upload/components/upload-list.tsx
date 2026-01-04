"use client";

import { Loader2, Box, Layers, Play, Upload } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Progress } from "@/components/atoms/progress";
import { ImageCard } from "@/components/molecules/image-card";
import type { UploadedImage } from "../types";
import { useUploadStore } from "../store/upload-store";
import { cn } from "@/lib/utils";

import {
    Card,
} from "@/components/atoms/card";

interface UploadListProps {
    images: UploadedImage[];
    isUploading: boolean;
    onUploadAll: () => void;
    onUploadOne: (index: number) => void;
    onRemove: (index: number) => void;
}

export function UploadList({
    images,
    isUploading,
    onUploadAll,
    onUploadOne,
    onRemove,
}: UploadListProps) {
    const { uploadMode, setUploadMode, updateImage } = useUploadStore();
    const pendingImages = images.filter((img) => !img.uploaded);

    if (images.length === 0) return null;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Control Header Card */}
            <Card className="relative overflow-hidden border-white/60 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-inner">
                            <Box className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground/90">Pending Images</h3>
                            <p className="text-sm font-medium text-muted-foreground">
                                {pendingImages.length} image{pendingImages.length !== 1 ? "s" : ""} ready for processing
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        {/* Mode Switcher */}
                        <div className="flex items-center rounded-full border border-zinc-200/50 bg-zinc-200/30 p-1.5 backdrop-blur-sm">
                            <button
                                onClick={() => setUploadMode("all")}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300",
                                    uploadMode === "all"
                                        ? "bg-white text-foreground shadow-sm scale-1.05"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Layers className="h-4 w-4" />
                                Upload All
                            </button>
                            <button
                                onClick={() => setUploadMode("one-by-one")}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300",
                                    uploadMode === "one-by-one"
                                        ? "bg-white text-foreground shadow-sm scale-1.05"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Play className="h-4 w-4" />
                                1 by 1
                            </button>
                        </div>

                        {uploadMode === "all" ? (
                            <Button
                                onClick={onUploadAll}
                                disabled={isUploading || pendingImages.length === 0}
                                className="h-13 rounded-full bg-primary px-10 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 disabled:scale-100"
                            >
                                {isUploading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Play className="mr-2 h-5 w-5 fill-current" />
                                )}
                                Start Processing
                            </Button>
                        ) : (
                            <div className="px-4 py-2 text-sm font-semibold text-muted-foreground/60 italic">
                                Ready for individual upload
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Images Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                    <div
                        key={image.imageId || `pending-${index}`}
                        className="group relative animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 80}ms`, animationDuration: "600ms" }}
                    >
                        <ImageCard
                            index={index}
                            id={image.imageId || `pending-${index}`}
                            storagePath={image.storagePath || image.preview}
                            fileName={image.file.name}
                            previewUrl={image.preview}
                            altText={image.altText}
                            onRemove={() => onRemove(index)}
                            onGenerated={(text) => updateImage(index, { altText: text })}
                            onUpload={uploadMode === "one-by-one" && !image.uploaded && !image.uploading && !image.error && image.altText ? () => onUploadOne(index) : undefined}
                            fileSize={image.file.size}
                            mimeType={image.file.type}
                            className="rounded-4xl border-white/40 shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl"
                        />

                        {/* Individual Upload Trigger - ONLY visible if alt text generated */}
                        {/* {uploadMode === "one-by-one" && !image.uploaded && !image.uploading && !image.error && image.altText && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-4xl bg-white/60 p-8 opacity-0 backdrop-blur-md transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
                                <Button
                                    onClick={() => onUploadOne(index)}
                                    className="h-12 translate-y-4 rounded-full bg-primary px-8 font-bold text-white shadow-xl transition-all duration-500 group-hover:translate-y-0"
                                >
                                    <Upload className="mr-2 h-5 w-5" />
                                    Upload Image
                                </Button>
                            </div>
                        )} */}

                        {image.uploading && (
                            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 rounded-4xl bg-white/90 p-8 backdrop-blur-2xl">
                                <div className="relative">
                                    <div className="h-24 w-24 animate-[spin_3s_linear_infinite] rounded-full border-4 border-primary/10" />
                                    <div className="absolute inset-0 h-24 w-24 animate-spin rounded-full border-t-4 border-primary" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="rounded-full bg-primary/10 p-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between text-sm font-bold text-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                                            <span>Processing...</span>
                                        </div>
                                        <span className="font-mono tabular-nums">{image.uploadProgress || 0}%</span>
                                    </div>
                                    <Progress
                                        value={image.uploadProgress || 0}
                                        className="h-3 rounded-full bg-primary/10"
                                        indicatorClassName="bg-primary"
                                    />
                                </div>
                            </div>
                        )}

                        {image.error && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 rounded-4xl border-2 border-red-100 bg-red-50/95 p-8 text-center backdrop-blur-xl shadow-2xl">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 shadow-inner">
                                    <Box className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-red-900 line-clamp-2">
                                        {image.error}
                                    </p>
                                    <p className="text-xs text-red-700/70 font-medium">Please try again</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onUploadOne(index)}
                                    className="mt-2 h-10 rounded-full px-8 font-bold shadow-lg shadow-red-200 transition-transform active:scale-95"
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
