import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  giftId: string;
  giftType: string;
  amount: number; // cents
  currency?: string;
}

// ── Validation ───────────────────────────────────────────────────────
function validate(body: CheckoutRequest): string | null {
  if (!body.giftId || typeof body.giftId !== "string") {
    return "giftId is required";
  }
  if (!body.giftType || typeof body.giftType !== "string") {
    return "giftType is required";
  }
  if (typeof body.amount !== "number" || body.amount < 50 || body.amount > 999999) {
    return "amount must be between 50 and 999999 (cents)";
  }
  if (body.currency && !/^[a-z]{3}$/i.test(body.currency)) {
    return "currency must be a 3-letter ISO code";
  }
  return null;
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
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const body: CheckoutRequest = await req.json();

    const validationError = validate(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const currency = (body.currency ?? "usd").toLowerCase();
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:8081";

    // Build form-encoded body for Stripe API
    const params = new URLSearchParams({
      "payment_method_types[]": "card",
      mode: "payment",
      "line_items[0][price_data][currency]": currency,
      "line_items[0][price_data][unit_amount]": String(body.amount),
      "line_items[0][price_data][product_data][name]":
        `GiftVerse ${body.giftType.replace("_", " ")}`,
      "line_items[0][quantity]": "1",
      success_url: `${siteUrl}/gift/${body.giftId}?payment=success`,
      cancel_url: `${siteUrl}/gift/${body.giftId}?payment=cancelled`,
      "metadata[gift_id]": body.giftId,
      "metadata[gift_type]": body.giftType,
    });

    const stripeRes = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    if (!stripeRes.ok) {
      const errText = await stripeRes.text();
      throw new Error(`Stripe API error (${stripeRes.status}): ${errText}`);
    }

    const session = await stripeRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
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
