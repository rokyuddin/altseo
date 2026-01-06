"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card";
import { useApiKeysStore } from "../store/api-keys-store";

export function NewKeyDisplay() {
    const { newKey, copyKey } = useApiKeysStore();
    const [copied, setCopied] = useState(false);

    if (!newKey) return null;

    const handleCopy = async () => {
        await copyKey(newKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="bg-green-50/50 dark:bg-green-900/20 slide-in-from-top-4 border-green-200 dark:border-green-900 animate-in duration-300 fade-in">
            <CardHeader>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Check className="w-5 h-5" />
                    <CardTitle>API Key Generated</CardTitle>
                </div>
                <CardDescription className="text-green-600/90 dark:text-green-400/90">
                    Please copy your API key now. You won't be able to see it again!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input
                            readOnly
                            value={newKey}
                            className="bg-white dark:bg-black/20 pr-24 border-green-200 dark:border-green-800 focus-visible:ring-green-500 font-mono text-sm"
                        />
                        <div className="top-1 right-1 bottom-1 absolute">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-green-100 dark:hover:bg-green-900/40 h-full text-green-700 dark:text-green-400"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-1.5 w-3.5 h-3.5" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1.5 w-3.5 h-3.5" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
