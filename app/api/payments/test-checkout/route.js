import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  // This endpoint is deliberately test-only. It must never create live charges.
  if (!secretKey || !secretKey.startsWith("sk_test_")) {
    return NextResponse.json(
      { error: "PayMongo test mode is not configured. Add a test secret key on the server." },
      { status: 503 }
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            description: "YoloTravelerAsia test payment (no real charge)",
            line_items: [
              {
                currency: "PHP",
                amount: 10000,
                name: "YoloTravelerAsia Test Item",
                quantity: 1,
              },
            ],
            payment_method_types: ["gcash", "paymaya", "card", "qrph"],
            success_url: `${origin}/?payment=success`,
            cancel_url: `${origin}/?payment=cancelled`,
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
          },
        },
      }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok) {
      console.error("PayMongo test checkout creation failed:", payload);
      return NextResponse.json(
        { error: "PayMongo could not create a test checkout session. Check the test key and enabled payment methods." },
        { status: response.status >= 400 && response.status < 500 ? 400 : 502 }
      );
    }

    const checkoutUrl = payload?.data?.attributes?.checkout_url;
    if (!checkoutUrl || typeof checkoutUrl !== "string") {
      console.error("PayMongo response did not contain checkout_url.");
      return NextResponse.json({ error: "The payment provider returned an invalid checkout response." }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Unexpected PayMongo test checkout error:", error);
    return NextResponse.json({ error: "Unable to start the test checkout. Please try again." }, { status: 500 });
  }
}
