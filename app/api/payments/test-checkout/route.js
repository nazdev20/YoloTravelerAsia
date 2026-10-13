import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  // This checkout route must only be used with a PayMongo test key.
  if (!secretKey || !secretKey.startsWith("sk_test_")) {
    return NextResponse.json(
      { error: "PayMongo test mode is not configured. Add a newly generated test secret key in Vercel Environment Variables." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    const amount = Number(body.amount);
    const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const itemNames = Array.isArray(body.itemNames) ? body.itemNames.filter((name) => typeof name === "string").slice(0, 20) : [];

    if (!orderId || !Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return NextResponse.json({ error: "Invalid order or payment amount." }, { status: 400 });
    }

    // PayMongo amounts are in centavos. The client sends a peso amount, so round to 2 decimals first.
    const amountInCentavos = Math.round(amount * 100);
    if (amountInCentavos < 100) {
      return NextResponse.json({ error: "The deposit must be at least ₱1.00 to use PayMongo checkout." }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [{
              currency: "PHP",
              amount: amountInCentavos,
              name: `YoloTravelerAsia booking deposit`,
              description: itemNames.join(", ").slice(0, 250) || `Booking ${orderId}`,
              quantity: 1,
            }],
            payment_method_types: ["gcash", "paymaya", "card", "qrph"],
            success_url: `${origin}/?payment=success&order_id=${encodeURIComponent(orderId)}`,
            cancel_url: `${origin}/list?payment=cancelled&order_id=${encodeURIComponent(orderId)}`,
            reference_number: `YTA-${orderId}`.slice(0, 50),
            send_email_receipt: false,
            metadata: {
              order_id: orderId,
              customer_email: customerEmail.slice(0, 200),
              integration: "yolotravelerasia",
            },
          },
        },
      }),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok) {
      console.error("PayMongo checkout creation failed:", payload);
      return NextResponse.json(
        { error: "PayMongo could not create checkout. Check that the test key is valid and these payment methods are enabled." },
        { status: response.status >= 400 && response.status < 500 ? 400 : 502 }
      );
    }

    const checkoutUrl = payload?.data?.attributes?.checkout_url;
    if (typeof checkoutUrl !== "string" || !checkoutUrl.startsWith("https://checkout.paymongo.com/")) {
      console.error("PayMongo response did not contain a valid hosted checkout URL.");
      return NextResponse.json({ error: "PayMongo returned an invalid checkout URL." }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Unexpected PayMongo checkout error:", error);
    return NextResponse.json({ error: "Unable to start PayMongo checkout. Please try again." }, { status: 500 });
  }
}
