"use client";

import dynamic from "next/dynamic";

// Give sign-in a concrete App Router route so direct visits and refreshes work.
const ExistingApp = dynamic(() => import("../../src/App.jsx"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-white text-slate-700">
      Loading Yolo Traveler Asia...
    </main>
  ),
});

export default function AuthPage() {
  return <ExistingApp />;
}
