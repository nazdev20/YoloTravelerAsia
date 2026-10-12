"use client";

import dynamic from "next/dynamic";

// The existing app uses browser-only APIs and React Router, so load it on the client.
// Next.js still serves this catch-all route for direct visits such as /auth.
const ExistingApp = dynamic(() => import("../../src/App.jsx"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-white text-slate-700">
      Loading Yolo Traveler Asia...
    </main>
  ),
});

export default function CatchAllPage() {
  return <ExistingApp />;
}
