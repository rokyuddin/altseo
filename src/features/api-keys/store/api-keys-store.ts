import { create } from "zustand";
import { generateApiKey, revokeApiKey } from "@/features/settings/actions/settings-actions";
import { ApiKey, ApiKeysState } from "../types";

export const useApiKeysStore = create<ApiKeysState>((set, get) => ({
    isLoading: false,
    isGenerating: false,
    newKey: null,
    error: null,
    revokingId: null,

    generateKey: async () => {
        set({ isGenerating: true, error: null, newKey: null });
        try {
            const result = await generateApiKey();

            if (result.error) {
                throw new Error(result.error);
            }

            if (result.key) {
                set({ newKey: result.key });
            }
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Something went wrong" });
        } finally {
            set({ isGenerating: false });
        }
    },

    revokeKey: async (id: string) => {
        set({ revokingId: id, error: null });
        try {
            const result = await revokeApiKey(id);

            if (result.error) {
                throw new Error(result.error);
            }
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to revoke key" });
        } finally {
            set({ revokingId: null });
        }
    },

    copyKey: async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("Failed to copy key:", err);
        }
    },

    resetNewKey: () => set({ newKey: null }),
    setError: (error) => set({ error }),
}));
