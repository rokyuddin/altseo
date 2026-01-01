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

interface ImageUploaderProps {
  allowGuest?: boolean;
}

export function ImageUploader({ allowGuest = false }: ImageUploaderProps) {
  const router = useRouter();
  const supabase = createClient();

  // Get state and actions from store
  const {
    images,
    savedImages,
    isUploading,
    isLoading,
    isPro,
    uploadMode,
    setIsUploading,
    addImages,
    removeImage,
    updateImage,
    loadSavedImages,
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

      updateImage(index, { uploadProgress: 70 });

      const metadataResult = await saveImageMetadata({
        storagePath: data.path,
        fileName: image.file.name,
        fileSize: image.file.size,
        mimeType: image.file.type,
        width: dimensions.width,
        height: dimensions.height,
      });

      await supabase.rpc("increment_rate_limit", { p_user_id: user.id });

      // Refresh limit and saved images
      router.refresh();
      await loadSavedImages();

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
  };

  const getImageUrl = (storagePath: string) => {
    if (storagePath.startsWith('blob:') || storagePath.startsWith('data:')) return storagePath;
    const { data } = supabase.storage.from("images").getPublicUrl(storagePath);
    return data.publicUrl;
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
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-12 border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.02)] space-y-10">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Drop your assets</h2>
          <p className="text-muted-foreground">
            We support PNG, JPG and WebP formats up to 10MB.
            {isPro ? " You're on Pro, so upload as many as you like!" : " Free users can upload 1 image at a time."}
          </p>
        </div>

        <UploadZone onFilesSelected={handleFilesSelected} multiple={isPro} />
      </div>

      <UploadList
        images={images}
        savedImages={savedImages}
        isUploading={isUploading}
        onUploadAll={handleUploadAll}
        onUploadOne={(idx) => uploadToSupabase(images[idx], idx)}
        onRemove={removeImage}
        getImageUrl={getImageUrl}
      />
    </div>
  );
}
