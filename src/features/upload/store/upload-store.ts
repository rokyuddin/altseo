import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { UploadedImage, SavedImage } from "../types";

interface UploadState {
    // State
    images: UploadedImage[];
    isUploading: boolean;
    isLoading: boolean;
    isPro: boolean;
    isAuthenticated: boolean;
    uploadMode: "all" | "one-by-one";

    // Global UI state
    isDragging: boolean;
    uploadError: string | null;

    // History UI state
    historyViewMode: "grid" | "list";
    deletingImageId: string | null;

    // Actions
    setHistoryViewMode: (mode: "grid" | "list") => void;
    setDeletingImageId: (id: string | null) => void;
    setIsDragging: (isDragging: boolean) => void;
    setUploadError: (error: string | null) => void;
    setImages: (images: UploadedImage[]) => void;
    setIsUploading: (isUploading: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsPro: (isPro: boolean) => void;
    setUploadMode: (mode: "all" | "one-by-one") => void;

    // Complex actions
    addImages: (files: File[]) => void;
    removeImage: (index: number) => void;
    updateImage: (index: number, updates: Partial<UploadedImage>) => void;
    generateAltText: (index: number, variant?: string) => Promise<string | null>;

    // Standalone generator state (for items not in 'images')
    standaloneStates: Record<string, Partial<UploadedImage>>;
    updateStandaloneState: (id: string, updates: Partial<UploadedImage>) => void;

    initData: (allowGuest: boolean) => Promise<void>;
    reset: () => void;
}

const initialState = {
    images: [],
    isUploading: false,
    isLoading: true,
    isPro: false,
    isAuthenticated: false,
    uploadMode: "all" as const,
    standaloneStates: {},
    historyViewMode: "grid" as const,
    deletingImageId: null,
    isDragging: false,
    uploadError: null,
};

export const useUploadStore = create<UploadState>((set, get) => ({
    ...initialState,

    // Simple setters
    setHistoryViewMode: (historyViewMode) => set({ historyViewMode }),
    setDeletingImageId: (deletingImageId) => set({ deletingImageId }),
    setIsDragging: (isDragging) => set({ isDragging }),
    setUploadError: (uploadError) => set({ uploadError }),
    setImages: (images) => set({ images }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsPro: (isPro) => set({ isPro }),
    setUploadMode: (uploadMode) => set({ uploadMode }),

    // Standalone state management
    updateStandaloneState: (id, updates) => {
        set((state) => ({
            standaloneStates: {
                ...state.standaloneStates,
                [id]: {
                    ...state.standaloneStates[id],
                    ...updates,
                },
            },
        }));
    },

    // Add new images
    addImages: (files) => {
        const newImages: UploadedImage[] = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            uploading: false,
            uploaded: false,
            uploadProgress: 0,
        }));

        set((state) => ({
            images: [...state.images, ...newImages],
        }));
    },

    // Remove image
    removeImage: (index) => {
        set((state) => {
            const newImages = [...state.images];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return { images: newImages };
        });
    },

    // Update specific image
    updateImage: (index, updates) => {
        set((state) => ({
            images: state.images.map((img, i) =>
                i === index ? { ...img, ...updates } : img
            ),
        }));
    },

    // Generate alt text for specific image
    generateAltText: async (index, variant = "default") => {
        const { images, updateImage } = get();
        const image = images[index];
        if (!image) return null;

        updateImage(index, { generating: true, error: undefined });

        try {
            let finalStoragePath = image.storagePath || image.preview;
            let isGuest = false;

            if (finalStoragePath.startsWith("blob:")) {
                isGuest = true;
                const response = await fetch(finalStoragePath);
                const blob = await response.blob();
                finalStoragePath = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
            } else if (finalStoragePath.startsWith("data:")) {
                isGuest = true;
            }

            const response = await fetch("/api/generate-alt-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageId: image.imageId,
                    storagePath: finalStoragePath,
                    variant,
                    isGuest,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate alt text");
            }

            updateImage(index, { altText: data.altText, generating: false });
            return data.altText;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to generate alt text";
            updateImage(index, { generating: false, error: message });
            return null;
        }
    },

    // Initialize data (user, subscription)
    initData: async (allowGuest = false) => {
        set({ isLoading: true });
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            // Load subscription
            const { data: subscription } = await supabase
                .from("user_subscriptions")
                .select("plan_type")
                .eq("user_id", user.id)
                .single();

            set({ isPro: subscription?.plan_type === "pro", isAuthenticated: true });
        } else {
            set({ isAuthenticated: false });
        }

        set({ isLoading: false });
    },

    // Reset store to initial state
    reset: () => {
        // Clean up preview URLs
        const { images } = get();
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        set(initialState);
    },
}));
