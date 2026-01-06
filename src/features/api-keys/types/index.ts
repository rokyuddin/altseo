export interface ApiKey {
    id: string;
    created_at: string;
    last_used_at: string | null;
    name?: string;
    key_hash?: string;
    user_id?: string;
    revoked_at?: string | null;
}

export interface ApiKeysState {
    isLoading: boolean;
    isGenerating: boolean;
    newKey: string | null;
    error: string | null;
    revokingId: string | null;

    // Actions
    generateKey: () => Promise<void>;
    revokeKey: (id: string) => Promise<void>;
    copyKey: (key: string) => Promise<void>;
    resetNewKey: () => void;
    setError: (error: string | null) => void;
}
