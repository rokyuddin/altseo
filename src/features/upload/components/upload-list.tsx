"use client";

import { Loader2, Box, Layers, Play, Upload } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Progress } from "@/components/atoms/progress";
import { ImageCard } from "@/components/molecules/image-card";
import { useUploadStore } from "../store/upload-store";
import type { UploadedImage, SavedImage } from "../types";

interface UploadListProps {
    images: UploadedImage[];
    isUploading: boolean;
    onUploadAll: () => void;
    onUploadOne: (index: number) => void;
    onRemove: (index: number) => void;
    getImageUrl: (path: string) => string;
}

export function UploadList({
    images,
    isUploading,
    onUploadAll,
    onUploadOne,
    onRemove,
    getImageUrl,
}: UploadListProps) {

    const { uploadMode, setUploadMode } = useUploadStore();

    const pendingImages = images.filter((img) => !img.uploaded);


    return (
        <div className="space-y-10">
            {/* Pending Uploads */}
            {images.length > 0 && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 rounded-[3rem] border border-white/60 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Box className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Pending Images</h3>
                                <p className="text-sm text-muted-foreground">
                                    {pendingImages.length} image{pendingImages.length !== 1 ? "s" : ""} ready
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Upload Mode Toggle */}
                            <div className="flex items-center bg-zinc-100/80 p-1 rounded-full border border-zinc-200">
                                <button
                                    onClick={() => setUploadMode("all")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${uploadMode === "all"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Layers className="h-3 w-3" />
                                    Upload All
                                </button>
                                <button
                                    onClick={() => setUploadMode("one-by-one")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${uploadMode === "one-by-one"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Play className="h-3 w-3" />
                                    1 by 1
                                </button>
                            </div>

                            {uploadMode === "all" ? (
                                <Button
                                    onClick={onUploadAll}
                                    disabled={isUploading || pendingImages.length === 0}
                                    className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold h-11"
                                >
                                    {isUploading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Play className="mr-2 h-4 w-4" />
                                    )}
                                    Start Processing
                                </Button>
                            ) : (
                                <span className="text-xs font-medium text-muted-foreground px-4">
                                    Upload individually below
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <ImageCard
                                    id={image.imageId || `pending-${index}`}
                                    storagePath={image.storagePath || image.preview}
                                    fileName={image.file.name}
                                    previewUrl={image.preview}
                                    onRemove={() => onRemove(index)}
                                    fileSize={image.file.size}
                                    mimeType={image.file.type}
                                />

                                {uploadMode === "one-by-one" && !image.uploaded && !image.uploading && (
                                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <Button
                                            onClick={() => onUploadOne(index)}
                                            className="w-full rounded-xl bg-white/90 backdrop-blur-md text-foreground hover:bg-white border-white shadow-xl font-bold py-6"
                                            variant="outline"
                                        >
                                            <Upload className="size-4" />
                                            Upload This Image
                                        </Button>
                                    </div>
                                )}

                                {image.uploading && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center rounded-4xl p-8 z-30 animate-in fade-in duration-300">
                                        <div className="relative mb-6">
                                            <div className="h-16 w-16 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            </div>
                                        </div>
                                        <div className="w-full space-y-3">
                                            <div className="flex justify-between text-xs font-bold text-foreground">
                                                <span>Uploading...</span>
                                                <span>{image.uploadProgress || 0}%</span>
                                            </div>
                                            <Progress
                                                value={image.uploadProgress || 0}
                                                className="h-2 rounded-full bg-zinc-100"
                                            />
                                        </div>
                                    </div>
                                )}

                                {image.error && (
                                    <div className="absolute inset-0 bg-red-50/90 backdrop-blur-md flex flex-col items-center justify-center rounded-4xl p-8 z-30 border border-red-200">
                                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                            <Box className="h-6 w-6 text-red-600" />
                                        </div>
                                        <p className="text-red-900 text-sm font-bold text-center mb-4 leading-tight">
                                            {image.error}
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onUploadOne(index)}
                                            className="rounded-full px-6"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

