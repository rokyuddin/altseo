import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { isProUser } from "@/lib/subscription";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";
import { performAiGeneration } from "@/app/api/generate-alt-text/route";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClientServer();
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { canProceed } = await checkRateLimit(user.id);
        const isPro = await isProUser(user.id);

        if (!canProceed && !isPro) {
            return NextResponse.json(
                { error: "Daily limit reached. Upgrade to Pro for unlimited uploads." },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validation
        const maxSize = isPro ? 20 * 1024 * 1024 : 10 * 1024 * 1024; // 20MB for Pro, 10MB Free
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File size too large. Max ${isPro ? 20 : 10}MB.` },
                { status: 400 }
            );
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only PNG, JPG, and WebP are allowed." },
                { status: 400 }
            );
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("images")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json(
                { error: "Upload failed: " + uploadError.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("images")
            .getPublicUrl(uploadData.path);

        // Generate Alt Text
        let altText = "";
        try {
            altText = await performAiGeneration(publicUrl, "default");
        } catch (err) {
            console.error("Auto-generation failed:", err);
            // Continue without alt text
        }

        const width = parseInt(formData.get("width") as string) || 0;
        const height = parseInt(formData.get("height") as string) || 0;

        const { data: imageData, error: dbError } = await supabase
            .from("images")
            .insert({
                user_id: user.id,
                storage_path: uploadData.path,
                file_name: file.name,
                file_size: file.size,
                mime_type: file.type,
                width: width,
                height: height,
                alt_text: altText,
            })
            .select()
            .single();

        if (dbError) {
            console.error("Database save error:", dbError);
            return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 });
        }

        await incrementRateLimit(user.id);

        return NextResponse.json({
            success: true,
            data: {
                ...imageData,
                publicUrl
            }
        });

    } catch (error) {
        console.error("Upload route error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
