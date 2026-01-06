import { createHash } from "node:crypto";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";
import { createClientServer } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Unified Prompts
const PROMPTS = {
  default:
    "Generate a concise, SEO-friendly alt text for this image. The alt text should be descriptive, accessible, and optimized for search engines. Keep it under 125 characters. Only return the alt text, nothing else.",
  seo: "Generate an SEO-optimized alt text for this image. Include relevant keywords naturally while maintaining accessibility. The description should be descriptive and help with search engine visibility. Keep it under 125 characters. Only return the alt text, nothing else.",
  long: "Generate a detailed, comprehensive description of this image. This should be a longer description suitable for detailed image descriptions. Keep it under 300 characters. Only return the description, nothing else.",
  accessibility:
    "Generate an accessibility-focused alt text for this image. Prioritize clarity and descriptive detail that would help someone using a screen reader understand the image content fully. Keep it under 200 characters. Only return the alt text, nothing else.",
};

// Sanitize AI response
function sanitizeText(text: string): string {
  let sanitized = text.replace(/<[^>]*>/g, "");
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
  sanitized = sanitized.replace(/[<>]/g, "");
  return sanitized.trim().substring(0, 500);
}

// AI Generation Helper
export async function performAiGeneration(
  imageUrl: string,
  variant: string,
) {
  const prompt = PROMPTS[variant as keyof typeof PROMPTS] || PROMPTS.default;

  const { text } = await generateText({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: imageUrl },
        ],
      },
    ],
  });

  return sanitizeText(text);
}

async function getUserFromRequest(
  request: NextRequest,
  supabase: Awaited<ReturnType<typeof createClientServer>>,
) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const apiKey = authHeader.substring(7);
    const apiKeyHash = createHash("sha256").update(apiKey).digest("hex");
    const adminClient = createAdminClient();

    const { data: apiKeyData, error: keyError } = await adminClient
      .from("api_keys")
      .select("user_id, key_hash, id")
      .eq("key_hash", apiKeyHash)
      .is("revoked_at", null)
      .single();

    if (keyError || !apiKeyData)
      return { error: "Invalid API key", status: 401 };

    const { data: subscription } = await adminClient
      .from("user_subscriptions")
      .select("plan_type")
      .eq("user_id", apiKeyData.user_id)
      .single();

    if (subscription?.plan_type !== "pro") {
      return { error: "API access requires Pro subscription", status: 403 };
    }

    await adminClient
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", apiKeyData.id);

    return {
      user: { id: apiKeyData.user_id },
      isApiKey: true,
      apiKeyId: apiKeyData.id,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 };

  return { user, isApiKey: false };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientServer();
    const body = await request.json();
    const {
      imageId,
      storagePath,
      imageUrl,
      variant = "default",
      isGuest = false,
    } = body;

    // 1. Handle Guest Flow (Limited to base64 images, no DB interaction)
    if (isGuest && storagePath?.startsWith("data:")) {
      const altText = await performAiGeneration(storagePath, variant);
      return NextResponse.json({ altText, guest: true });
    }

    if (isGuest && storagePath?.startsWith("blob:")) {
      return NextResponse.json(
        { error: "Blob URLs cannot be processed server-side. Please convert to base64 data URL." },
        { status: 400 },
      );
    }

    // 2. Authentication and Client Selection
    const authResult = await getUserFromRequest(request, supabase);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 },
      );
    }

    const { user, isApiKey, apiKeyId } = authResult;

    /**
     * BEST PRACTICE: For API keys, we MUST use the Admin Client because the request 
     * lacks a Supabase Auth session. However, we must manually enforce security 
     * (RLS bypass) by always filtering by user_id.
     */
    const db = (isApiKey ? createAdminClient() : supabase) as any;

    // 3. Rate Limiting (Skip for Pro API keys, check for session users)
    if (!isApiKey) {
      const rateLimitStatus = await checkRateLimit(user.id);
      if (!rateLimitStatus.canProceed) {
        return NextResponse.json(
          {
            error: `Daily limit reached (${rateLimitStatus.limit} images). Upgrade to Pro for unlimited generations.`,
            limit: rateLimitStatus.limit,
            count: rateLimitStatus.count,
          },
          { status: 429 },
        );
      }
    }

    // 4. Resolve Image Information
    let cacheKey = storagePath || imageUrl;
    let finalUrl = imageUrl;

    if (imageId) {
      // Query images table - ALWAYS scope by user_id since db might be Admin
      const { data: imageData, error: imageError } = await db
        .from("images")
        .select("storage_path")
        .eq("id", imageId)
        .eq("user_id", user.id)
        .single();

      if (imageError || !imageData) {
        return NextResponse.json({ error: "Image not found or unauthorized" }, { status: 404 });
      }

      cacheKey = imageData.storage_path;
      const { data: urlData } = db.storage.from("images").getPublicUrl(imageData.storage_path);

      if (!urlData?.publicUrl) {
        return NextResponse.json({ error: "Failed to generate public URL" }, { status: 500 });
      }
      finalUrl = urlData.publicUrl;
    } else if (storagePath) {
      // Resolve path directly if provided (internal usage)
      const { data: urlData } = db.storage.from("images").getPublicUrl(storagePath);
      finalUrl = urlData.publicUrl;
    }

    if (!finalUrl) {
      return NextResponse.json({ error: "No image source provided" }, { status: 400 });
    }

    // 5. Cache Layer (Check for existing generation)
    // Cache is collaborative but storage_path is unique per user bucket/folder
    const { data: cached } = await db
      .from("generation_cache")
      .select("alt_text")
      .eq("storage_path", cacheKey)
      .eq("variant", variant)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached?.alt_text) {
      if (isApiKey && apiKeyId) {
        await logApiKeyUsage(user.id, apiKeyId, 200);
      }
      return NextResponse.json({ altText: cached.alt_text, cached: true });
    }

    // 6. AI Execution
    const altText = await performAiGeneration(finalUrl, variant);

    // 7. Success Actions: Cache, Update, Log
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Save to cache (Atomic upsert)
    await db.from("generation_cache").upsert(
      {
        storage_path: cacheKey,
        alt_text: altText,
        variant,
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: "storage_path,variant" },
    );

    // Update image record if imageId was provided
    if (imageId) {
      await db
        .from("images")
        .update({ alt_text: altText })
        .eq("id", imageId)
        .eq("user_id", user.id);
    }

    // Finalize logging
    if (isApiKey && apiKeyId) {
      await logApiKeyUsage(user.id, apiKeyId, 200);
    } else {
      await incrementRateLimit(user.id);
    }

    return NextResponse.json({ altText });
  } catch (error) {
    console.error("Alt text API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Helper to log API key usage consistently
 */
async function logApiKeyUsage(userId: string, apiKeyId: string, status: number) {
  const admin = createAdminClient();
  return admin.from("api_request_logs").insert({
    user_id: userId,
    api_key_id: apiKeyId,
    endpoint: "/api/generate-alt-text",
    method: "POST",
    status_code: status,
  });
}

