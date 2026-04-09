import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Allowed enum values ───────────────────────────────────────────────────
const GIFT_TYPES = ["gift_game", "birthday_card", "invitation"] as const;
const TONES = [
  "playful",
  "heartfelt",
  "funny",
  "elegant",
  "nostalgic",
] as const;
const VISUAL_STYLES = [
  "modern",
  "retro",
  "whimsical",
  "minimalist",
  "luxe",
] as const;

// ── Input types ──────────────────────────────────────────────────────
interface GenerateGiftRequest {
  giftType: string;
  occasion: string;
  tone: string;
  visualStyle: string;
  senderName: string;
  recipientName: string;
  personalMessage?: string;
}

// ── Validation helpers ─────────────────────────────────────────────────
function sanitize(input: string, maxLen = 500): string {
  return input.replace(/[<>]/g, "").trim().slice(0, maxLen);
}

function validate(body: GenerateGiftRequest): string | null {
  if (!body.giftType || !GIFT_TYPES.includes(body.giftType as any)) {
    return `Invalid giftType. Must be one of: ${GIFT_TYPES.join(", ")}`;
  }
  if (!body.occasion || body.occasion.length > 200) {
    return "occasion is required (max 200 chars)";
  }
  if (!body.tone || !TONES.includes(body.tone as any)) {
    return `Invalid tone. Must be one of: ${TONES.join(", ")}`;
  }
  if (!body.visualStyle || !VISUAL_STYLES.includes(body.visualStyle as any)) {
    return `Invalid visualStyle. Must be one of: ${VISUAL_STYLES.join(", ")}`;
  }
  if (!body.senderName || body.senderName.length > 100) {
    return "senderName is required (max 100 chars)";
  }
  if (!body.recipientName || body.recipientName.length > 100) {
    return "recipientName is required (max 100 chars)";
  }
  if (body.personalMessage && body.personalMessage.length > 1000) {
    return "personalMessage must be 1000 chars or fewer";
  }
  return null;
}

// ── System prompts by gift type ────────────────────────────────────────
function buildSystemPrompt(giftType: string): string {
  const base =
    "You are a creative gift content generator for an app called GiftVerse. " +
    "Return ONLY valid JSON with no markdown fences. " +
    "The JSON must be an array of content blocks, each with { type, content, order }.";

  const specifics: Record<string, string> = {
    gift_game:
      `${base} ` +
      "Generate an interactive gift-unwrapping game with 4-6 content blocks. " +
      'Block types: "riddle", "trivia", "message", "reveal". ' +
      "Make it fun and themed to the occasion.",
    birthday_card:
      `${base} ` +
      "Generate a heartfelt birthday card with 3-5 content blocks. " +
      'Block types: "greeting", "poem", "wish", "closing". ' +
      "Match the requested tone.",
    invitation:
      `${base} ` +
      "Generate a stylish event invitation with 3-5 content blocks. " +
      'Block types: "headline", "details", "rsvp_prompt", "closing". ' +
      "Keep details placeholder-friendly so the sender can fill in specifics.",
  };

  return specifics[giftType] ?? base;
}

// ── Main handler ─────────────────────────────────────────────────────
serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const body: GenerateGiftRequest = await req.json();

    // Validate
    const validationError = validate(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    // Sanitize
    const occasion = sanitize(body.occasion, 200);
    const senderName = sanitize(body.senderName, 100);
    const recipientName = sanitize(body.recipientName, 100);
    const personalMessage = body.personalMessage
      ? sanitize(body.personalMessage, 1000)
      : "";

    const systemPrompt = buildSystemPrompt(body.giftType);

    const userPrompt =
      `Create a ${body.giftType.replace("_", " ")} for the occasion: "${occasion}". ` +
      `Tone: ${body.tone}. Visual style: ${body.visualStyle}. ` +
      `From: ${senderName}. To: ${recipientName}. ` +
      (personalMessage
        ? `Personal message to weave in: "${personalMessage}".`
        : "");

    // Call OpenAI
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.8,
          max_tokens: 1024,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      },
    );

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      throw new Error(`OpenAI API error (${openaiRes.status}): ${errText}`);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content ?? "[]";

    // Parse content blocks
    let contentBlocks: unknown[];
    try {
      contentBlocks = JSON.parse(rawContent);
      if (!Array.isArray(contentBlocks)) {
        throw new Error("Expected array");
      }
    } catch {
      throw new Error("Failed to parse AI response as content blocks");
    }

    // Generate a share slug
    const shareSlug = crypto.randomUUID().slice(0, 12);

    return new Response(
      JSON.stringify({
        success: true,
        gift: {
          id: crypto.randomUUID(),
          giftType: body.giftType,
          occasion,
          senderName,
          recipientName,
          tone: body.tone,
          visualStyle: body.visualStyle,
          personalMessage,
          contentBlocks,
          shareSlug,
        },
      }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
