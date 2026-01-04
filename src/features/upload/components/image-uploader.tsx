"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadZone } from "@/components/molecules/upload-zone";
import { saveImageMetadata } from "../actions/upload-actions";
import { validateImageDimensions } from "@/lib/image-validation";
import { validateUploadedImage } from "../actions/guest-upload-actions";
import { UploadList } from "./upload-list";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUploadStore } from "../store/upload-store";
import type { UploadedImage } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/atoms/card";

interface ImageUploaderProps {
  allowGuest?: boolean;
}

export function ImageUploader({ allowGuest = false }: ImageUploaderProps) {
  const router = useRouter();
  const supabase = createClient();

  // Get state and actions from store
  const {
    images,
    isUploading,
    isLoading,
    isPro,
    uploadMode,
    setIsUploading,
    addImages,
    removeImage,
    updateImage,
    setImages,
    initData,
  } = useUploadStore();


  useEffect(() => {
    initData(allowGuest);
  }, [allowGuest, initData]);

  const handleFilesSelected = async (files: File[]) => {
    if (!isPro && files.length > 1) {
      alert("Free users can only upload one image at a time. Please upgrade to Pro for multiple uploads.");
      return;
    }

    addImages(files);
  };

  const uploadToSupabase = async (image: UploadedImage, index: number) => {
    updateImage(index, { uploading: true, uploadProgress: 0, error: undefined });

    try {
      const validation = await validateUploadedImage(image.file);
      if (!validation.valid) throw new Error(validation.error);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user && allowGuest) {
        const dimensions = await getImageDimensions(image.file);
        const dimValidation = await validateImageDimensions(dimensions.width, dimensions.height);
        if (!dimValidation.valid) throw new Error(dimValidation.error);

        updateImage(index, { uploading: false, uploaded: true, uploadProgress: 100, storagePath: image.preview });
        return image.preview;
      }

      if (!user) throw new Error("Please sign up to save your images");

      const dimensions = validation.dimensions || (await getImageDimensions(image.file));
      const fileExt = image.file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}_${index}.${fileExt}`;

      updateImage(index, { uploadProgress: 30 });

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, image.file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      updateImage(index, { uploadProgress: 60 });

      // Use pre-generated alt text if available or generate one
      let generatedAltText = image.altText || "";

      if (!generatedAltText) {
        updateImage(index, { uploadProgress: 75 });
        const result = await useUploadStore.getState().generateAltText(index);
        generatedAltText = result || "";
      }

      updateImage(index, { uploadProgress: 80 });

      const metadataResult = await saveImageMetadata({
        storagePath: data.path,
        fileName: image.file.name,
        fileSize: image.file.size,
        mimeType: image.file.type,
        width: dimensions.width,
        height: dimensions.height,
        altText: generatedAltText,
      });

      await supabase.rpc("increment_rate_limit", { p_user_id: user.id });

      // Refresh limit
      router.refresh();


      updateImage(index, {
        uploading: false,
        uploaded: true,
        uploadProgress: 100,
        storagePath: data.path,
        imageId: metadataResult.data?.id
      });


      return data.path;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      updateImage(index, { uploading: false, error: message });
      return null;
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);
    const pendingIndices = images
      .map((img, idx) => ({ img, idx }))
      .filter(({ img }) => !img.uploaded && !img.uploading)
      .map(({ idx }) => idx);

    // Process sequentially to be safer with rate limits and state
    for (const index of pendingIndices) {
      await uploadToSupabase(images[index], index);
    }

    setIsUploading(false);
    // Remove successfully uploaded images from the current state
    const currentImages = useUploadStore.getState().images;
    setImages(currentImages.filter((img) => !img.uploaded));
  };


  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.02)] border overflow-hidden flex flex-col gap-8 md:gap-12 animate-in fade-in zoom-in duration-1000">
        <CardHeader className="text-center max-w-3xl mx-auto p-0 border-none shadow-none bg-transparent w-full flex flex-col items-center gap-4">
          <CardTitle className="text-3xl md:text-5xl font-black tracking-tight text-foreground/90 leading-[1.1]">
            Drop your assets
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            We support PNG, JPG and WebP formats up to 10MB.
            {isPro ? (
              <span className="block mt-2 text-primary/80 font-bold uppercase text-xs tracking-widest">
                Pro Member Unlimited Uploads
              </span>
            ) : (
              <span className="block mt-2 font-medium">
                Free users can upload 1 image at a time.
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <UploadZone
            onFilesSelected={handleFilesSelected}
            multiple={isPro}
            className="rounded-[2.5rem]"
          />
        </CardContent>
      </Card>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        <UploadList
          images={images}
          isUploading={isUploading}
          onUploadAll={handleUploadAll}
          onUploadOne={async (idx) => {
            const result = await uploadToSupabase(images[idx], idx);
            if (result) {
              // Small delay to show completion before removing
              setTimeout(() => {
                removeImage(idx);
              }, 1500);
            }
          }}
          onRemove={removeImage}
        />
      </div>
    </div>
  );
}