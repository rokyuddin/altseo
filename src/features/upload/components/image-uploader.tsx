"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadZone } from "@/components/molecules/upload-zone";
import { ImageCard } from "@/components/molecules/image-card";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Progress } from "@/components/atoms/progress";
import { CloudCog, Loader2, AlertCircle } from "lucide-react";
import { saveImageMetadata } from "../actions/upload-actions";
import {
  validateImageFile,
  validateImageDimensions,
} from "@/lib/image-validation";
import { validateUploadedImage } from "../actions/guest-upload-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";

interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  uploadProgress?: number;
  error?: string;
  storagePath?: string;
  imageId?: string;
}

interface SavedImage {
  id: string;
  storage_path: string;
  file_name: string;
  alt_text: string | null;
  width?: number | null;
  height?: number | null;
  file_size?: number | null;
  mime_type?: string | null;
}

interface ImageUploaderProps {
  allowGuest?: boolean;
}

export function ImageUploader({ allowGuest = false }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const supabase = createClient();

  // Load saved images on mount
  useEffect(() => {
    checkAuth();
    if (!allowGuest) {
      loadSavedImages();
    } else {
      setIsLoading(false);
    }
  }, [allowGuest]);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsGuest(!user);
  };

  const loadSavedImages = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedImages(data || []);
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    // Check if user can upload multiple files
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("plan_type")
        .eq("user_id", user.id)
        .single();

      const isPro = subscription?.plan_type === "pro";

      // Enforce single upload for free users
      if (!isPro && files.length > 1) {
        alert(
          "Free users can only upload one image at a time. Please upgrade to Pro for multiple uploads.",
        );
        return;
      }
    }

    const newImages: UploadedImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      uploadProgress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const uploadToSupabase = async (image: UploadedImage, index: number) => {
    // Update state to show uploading
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, uploading: true, uploadProgress: 0 } : img,
      ),
    );

    try {
      // Server-side validation (more secure)
      const validation = await validateUploadedImage(image.file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // For guests, just use object URL (no storage upload)
      if (!user && allowGuest) {
        const dimensions = await getImageDimensions(image.file);
        const dimValidation = await validateImageDimensions(
          dimensions.width,
          dimensions.height,
        );
        if (!dimValidation.valid) {
          throw new Error(dimValidation.error);
        }

        // For guests, just mark as uploaded with preview URL
        setImages((prev) =>
          prev.map((img, i) =>
            i === index
              ? {
                  ...img,
                  uploading: false,
                  uploaded: true,
                  uploadProgress: 100,
                  storagePath: image.preview, // Use preview URL for guests
                }
              : img,
          ),
        );
        return;
      }

      if (!user) throw new Error("Please sign up to save your images");

      // Check rate limit before upload
      const { data: rateLimit } = await supabase.rpc(
        "get_or_create_rate_limit",
        {
          p_user_id: user.id,
        },
      );

      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("plan_type")
        .eq("user_id", user.id)
        .single();

      const isPro = subscription?.plan_type === "pro";
      const dailyLimit = isPro ? Infinity : 10;
      const currentCount = rateLimit?.image_count || 0;

      if (!isPro && currentCount >= dailyLimit) {
        throw new Error(
          `Daily limit reached (${dailyLimit} images). Upgrade to Pro for unlimited uploads.`,
        );
      }

      // Use dimensions from validation
      const dimensions =
        validation.dimensions || (await getImageDimensions(image.file));

      // Generate unique file name
      const fileExt = image.file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      // Note: Supabase doesn't support native upload progress, so we simulate it
      setImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, uploadProgress: 50 } : img,
        ),
      );

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, image.file, {
          cacheControl: "3600",
          upsert: false,
        });

      // Update to 100% after successful upload
      setImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, uploadProgress: 100 } : img,
        ),
      );

      if (error) throw error;

      // Save metadata to database
      const metadataResult = await saveImageMetadata({
        storagePath: data.path,
        fileName: image.file.name,
        fileSize: image.file.size,
        mimeType: image.file.type,
        width: dimensions.width,
        height: dimensions.height,
      });

      // Increment rate limit
      await supabase.rpc("increment_rate_limit", {
        p_user_id: user.id,
      });

      if (metadataResult.error) {
        console.error("Metadata save error:", metadataResult.error);
      }

      // Update state to show success
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                uploading: false,
                uploaded: true,
                uploadProgress: 100,
                storagePath: data.path,
                imageId: metadataResult.data?.id,
              }
            : img,
        ),
      );

      // Reload saved images
      await loadSavedImages();

      return data.path;
    } catch (error) {
      console.error("Upload error:", error);
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                uploading: false,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : img,
        ),
      );
      return null;
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);

    const uploadPromises = images
      .filter((img) => !img.uploaded && !img.uploading)
      .map((img, idx) => {
        const actualIndex = images.indexOf(img);
        return uploadToSupabase(img, actualIndex);
      });

    await Promise.all(uploadPromises);
    setIsUploading(false);

    // Clear uploaded images from the pending list
    setImages((prev) => prev.filter((img) => !img.uploaded));
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from("images").getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const getImageDimensions = (
    file: File,
  ): Promise<{ width: number; height: number }> => {
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
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {isGuest && allowGuest && (
        <Alert className="rounded-2xl border-2 border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">
              You're using AltSEO as a guest. <strong>Sign up</strong> to save
              your images and download results.
            </span>
            <Button
              size="sm"
              className="ml-4 rounded-full"
              onClick={() => (window.location.href = "/register")}
            >
              Sign Up Free
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Upload images to generate SEO-friendly alt text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UploadZone onFilesSelected={handleFilesSelected} multiple />

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {images.length} image{images.length > 1 ? "s" : ""} ready to
                  upload
                </p>
                <Button
                  onClick={handleUploadAll}
                  disabled={isUploading || images.every((img) => img.uploaded)}
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upload All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <ImageCard
                      id={image.imageId || `guest-${index}`}
                      storagePath={image.storagePath || image.preview}
                      fileName={image.file.name}
                      previewUrl={image.preview}
                      onRemove={() => removeImage(index)}
                      fileSize={image.file.size}
                      mimeType={image.file.type}
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg p-4">
                        <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
                        <div className="w-full max-w-48 space-y-2">
                          <Progress
                            value={image.uploadProgress || 0}
                            className="h-2"
                          />
                          <p className="text-white text-xs text-center font-medium">
                            {image.uploadProgress || 0}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {savedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Images</CardTitle>
            <CardDescription>
              Previously uploaded images with generated alt text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedImages.map((image) => (
                <ImageCard
                  key={image.id}
                  id={image.id}
                  storagePath={image.storage_path}
                  fileName={image.file_name}
                  altText={image.alt_text}
                  previewUrl={getImageUrl(image.storage_path)}
                  width={image.width}
                  height={image.height}
                  fileSize={image.file_size}
                  mimeType={image.mime_type}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
