# Iventlan — ES/EN Providers MVP (Next.js 14 + Supabase)

**Includes**
- ES/EN routing (`/[locale]`), header toggle.
- Home, Providers list, Provider detail, Quote form.
- Provider registration with **optional price** and image uploads to Supabase Storage.
- Dashboards: `/[locale]/dashboard/provider` and `/[locale]/dashboard/admin` (verify / delete).
- Native ads via `promotions` (sponsored slots).
- Supabase schema in `supabase/schema.sql`, seeds in `scripts/seed.ts`.

## Setup
1) Copy `.env.example` → `.env.local`, fill:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (server) `SUPABASE_URL`, `SUPABASE_ANON_KEY` (optional)
2) In Supabase Storage create buckets:
   - `providers-gallery` (public)
   - `providers-auth` (private)
3) Run schema in Supabase SQL editor (`supabase/schema.sql`).
4) Install & dev:
   ```bash
   npm i
   npm run dev
   ```
5) Seed data (optional):
   ```bash
   npm run seed
   ```

> NOTE: RLS is minimal; add stricter role checks before production.
