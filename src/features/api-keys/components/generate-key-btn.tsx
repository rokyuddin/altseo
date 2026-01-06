"use client"
import { Button } from '@/components/atoms/button';
import { useApiKeysStore } from '../store/api-keys-store';
import { Loader2, Plus } from 'lucide-react';

export default function GenerateKeyBtn() {
    const { isGenerating, generateKey } = useApiKeysStore();

    return (
        <Button onClick={generateKey} disabled={isGenerating}>
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Plus className="mr-2 w-4 h-4" />
                    Generate New Key
                </>
            )}
        </Button>
    )
}
