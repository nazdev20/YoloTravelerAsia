# Supabase Setup

1. Create the tables with the supplied YTA schema, then run `supabase-setup.sql` in the Supabase SQL Editor.
2. In **Project Settings > API > Exposed schemas**, expose the exact schema name `YTA` so the Supabase client can access its tables.
3. Enable Google under **Authentication > Providers**, set Supabase's callback URL as an authorized redirect URI in Google Cloud, and add the local and deployed app URLs to Supabase's redirect URL allow-list.
4. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project API settings.
5. Assign `app_metadata.role = "admin"` to trusted administrator users from a secure server or the Supabase dashboard. Never put a service-role key in this frontend.

The SQL setup creates the catalog/payment storage buckets and RLS policies. Catalog reads are public; catalog writes require the trusted admin claim. Cart and order access is scoped to the authenticated owner.

Run `npm run dev` after setting the environment variables.
