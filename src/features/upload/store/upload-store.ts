import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { UploadedImage, SavedImage } from "../types";

interface UploadState {
    // State
    images: UploadedImage[];
    savedImages: SavedImage[];
    isUploading: boolean;
    isLoading: boolean;
    isPro: boolean;
    uploadMode: "all" | "one-by-one";

    // Actions
    setImages: (images: UploadedImage[]) => void;
    setSavedImages: (images: SavedImage[]) => void;
    setIsUploading: (isUploading: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsPro: (isPro: boolean) => void;
    setUploadMode: (mode: "all" | "one-by-one") => void;

    // Complex actions
    addImages: (files: File[]) => void;
    removeImage: (index: number) => void;
    updateImage: (index: number, updates: Partial<UploadedImage>) => void;
    loadSavedImages: () => Promise<void>;
    initData: (allowGuest: boolean) => Promise<void>;
    reset: () => void;
}

const initialState = {
    images: [],
    savedImages: [],
    isUploading: false,
    isLoading: true,
    isPro: false,
    uploadMode: "all" as const,
};

export const useUploadStore = create<UploadState>((set, get) => ({
    ...initialState,

    // Simple setters
    setImages: (images) => set({ images }),
    setSavedImages: (savedImages) => set({ savedImages }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsPro: (isPro) => set({ isPro }),
    setUploadMode: (uploadMode) => set({ uploadMode }),

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

    // Load saved images from database
    loadSavedImages: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("images")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            set({ savedImages: data || [] });
        }
    },

    // Initialize data (user, subscription, images)
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

            set({ isPro: subscription?.plan_type === "pro" });

            // Load saved images
            await get().loadSavedImages();
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
