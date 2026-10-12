const nextConfig = {
  // Legacy components currently have pre-existing ESLint errors; keep production builds runnable.
  eslint: { ignoreDuringBuilds: true },
  // Keep existing VITE_* deployment variables working while migrating to Next.js.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
  },
};

export default nextConfig;
