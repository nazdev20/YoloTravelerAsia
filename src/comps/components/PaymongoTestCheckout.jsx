"use client";

import { useState } from "react";

export default function PaymongoTestCheckout() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function startCheckout() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/payments/test-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error || "Could not start the test checkout.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-12 text-slate-900">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
          Developer testing
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">PayMongo test checkout</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Try the payment-provider flow for YoloTravelerAsia using PayMongo Test Mode.
          This creates a fixed PHP 100.00 test checkout session and must not charge real money.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600">Test item</span>
            <span className="font-medium">YoloTravelerAsia</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
            <span className="font-semibold">Test total</span>
            <span className="text-2xl font-bold">₱100.00</span>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-500">
          Use only PayMongo test payment details. After the provider redirects back, the browser
          returns to the YoloTravelerAsia home page. This demo does not create or confirm a real booking.
        </p>

        {errorMessage && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={startCheckout}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating test checkout..." : "Continue to PayMongo test checkout"}
        </button>

        <a href="/" className="mt-4 block text-center text-sm font-medium text-slate-600 hover:text-slate-900">
          Return to home
        </a>
      </section>
    </main>
  );
}
