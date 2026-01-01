import { createHash } from "node:crypto";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

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
async function performAiGeneration(
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
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const apiKey = authHeader.substring(7);
    const apiKeyHash = createHash("sha256").update(apiKey).digest("hex");

    const { data: apiKeyData, error: keyError } = await supabase
      .from("api_keys")
      .select("user_id, key_hash, id")
      .eq("key_hash", apiKeyHash)
      .is("revoked_at", null)
      .single();

    if (keyError || !apiKeyData)
      return { error: "Invalid API key", status: 401 };

    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("plan_type")
      .eq("user_id", apiKeyData.user_id)
      .single();

    if (subscription?.plan_type !== "pro") {
      return { error: "API access requires Pro subscription", status: 403 };
    }

    await supabase
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
    const supabase = await createClient();
    const body = await request.json();
    const { imageId, storagePath, variant = "default", isGuest = false } = body;

    // 1. Handle Guest Flow
    if (
      isGuest &&
      storagePath &&
      (storagePath.startsWith("blob:") || storagePath.startsWith("data:"))
    ) {
      if (storagePath.startsWith("blob:")) {
        return NextResponse.json(
          {
            error:
              "Blob URLs cannot be processed server-side. Please convert to base64 data URL.",
          },
          { status: 400 },
        );
      }
      const altText = await performAiGeneration(
        storagePath,
        variant,
      );
      return NextResponse.json({ altText, guest: true });
    }

    // 2. Authentication and Authorization
    const authResult = await getUserFromRequest(request, supabase);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 },
      );
    }
    const { user, isApiKey, apiKeyId } = authResult;

    if (!imageId && !storagePath) {
      return NextResponse.json(
        { error: "imageId or storagePath is required" },
        { status: 400 },
      );
    }

    // 3. Rate Limiting (Non-API key)
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

    // 4. Resolve Image Path
    let imagePath = storagePath;
    if (imageId) {
      const { data: imageData, error: imageError } = await supabase
        .from("images")
        .select("storage_path")
        .eq("id", imageId)
        .eq("user_id", user.id)
        .single();

      if (imageError || !imageData) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      imagePath = imageData.storage_path;
    }

    // 5. Cache Check
    const { data: cached } = await supabase
      .from("generation_cache")
      .select("alt_text")
      .eq("storage_path", imagePath)
      .eq("variant", variant)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached?.alt_text) {
      if (isApiKey && apiKeyId) {
        await supabase.from("api_request_logs").insert({
          user_id: user.id,
          api_key_id: apiKeyId,
          endpoint: "/api/generate-alt-text",
          method: "POST",
          status_code: 200,
        });
      }
      return NextResponse.json({ altText: cached.alt_text, cached: true });
    }

    // 6. Get Public URL and Generate
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(imagePath);
    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to get image URL" },
        { status: 500 },
      );
    }

    const altText = await performAiGeneration(urlData.publicUrl, variant);

    // 7. Save and Log
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await supabase.from("generation_cache").upsert(
      {
        storage_path: imagePath,
        alt_text: altText,
        variant,
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: "storage_path,variant" },
    );

    if (imageId) {
      await supabase
        .from("images")
        .update({ alt_text: altText })
        .eq("id", imageId)
        .eq("user_id", user.id);
    }

    if (!isApiKey) {
      await incrementRateLimit(user.id);
    } else if (apiKeyId) {
      await supabase.from("api_request_logs").insert({
        user_id: user.id,
        api_key_id: apiKeyId,
        endpoint: "/api/generate-alt-text",
        method: "POST",
        status_code: 200,
      });
    }

    return NextResponse.json({ altText });
  } catch (error) {
    console.error("Alt text generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate alt text",
      },
      { status: 500 },
    );
  }
}
