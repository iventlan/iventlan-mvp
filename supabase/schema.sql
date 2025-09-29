-- Iventlan schema (Supabase)

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text check (role in ('client','provider','admin')) not null default 'client',
  display_name text,
  phone text,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;
create policy "profiles_self_select" on public.profiles for select using ( auth.uid() = id );
create policy "profiles_self_update" on public.profiles for update using ( auth.uid() = id );

create table if not exists public.categories (
  id serial primary key,
  slug text unique not null,
  name_es text not null,
  name_en text not null,
  cover_url text
);
alter table public.categories enable row level security;
create policy "categories_read_all" on public.categories for select using (true);

create table if not exists public.providers (
  id serial primary key,
  owner_id uuid references auth.users,
  slug text unique not null,
  brand_name text not null,
  category_slug text references public.categories(slug) not null,
  city text not null default 'Mazatlán',
  price_min numeric null,
  price_max numeric null,
  short_bio_es text not null,
  short_bio_en text not null,
  sla_es text not null,
  sla_en text not null,
  response_time_min integer default 30,
  tags text[] default '{}'::text[],
  images text[] default '{}'::text[],
  verification_status text check (verification_status in ('pending','verified','needs_more_info','rejected')) default 'pending',
  auth_role text,
  legal_name text,
  corp_email text,
  auth_methods text[] default '{}'::text[],
  auth_evidence_urls text[] default '{}'::text[],
  verified_at timestamp with time zone,
  verified_by uuid references auth.users,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.providers enable row level security;
create policy "providers_read_all" on public.providers for select using (true);
create policy "providers_insert_owner" on public.providers for insert with check ( owner_id = auth.uid() or owner_id is null );
create policy "providers_update_owner" on public.providers for update using ( owner_id = auth.uid() ) with check ( owner_id = auth.uid() );

create table if not exists public.provider_images (
  id serial primary key,
  provider_id integer references public.providers(id) on delete cascade,
  image_url text not null,
  position int default 0,
  created_at timestamp with time zone default now()
);
alter table public.provider_images enable row level security;
create policy "provider_images_read_all" on public.provider_images for select using (true);

create table if not exists public.leads (
  id serial primary key,
  client_id uuid references auth.users,
  date date,
  colonia text,
  guests int,
  budget_band text,
  notes text,
  selected_provider_slugs text[] default '{}'::text[],
  status text check (status in ('new','sent','responded')) default 'new',
  created_at timestamp with time zone default now()
);
alter table public.leads enable row level security;
create policy "leads_insert_all" on public.leads for insert with check (true);
create policy "leads_read_admin_only" on public.leads for select using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') );

create table if not exists public.promotions (
  id serial primary key,
  provider_id int references public.providers(id) on delete cascade,
  type text check (type in ('native_card','chip','mini_card')) not null,
  placement text check (placement in ('home_top','category_top','category_mid','detail_sidebar','quote_tip')) not null,
  title_es text,
  title_en text,
  subtitle_es text,
  subtitle_en text,
  image_url text,
  cta_text_es text default 'Ver proveedor',
  cta_text_en text default 'View provider',
  target_category_slug text,
  target_city text,
  start_at timestamp with time zone default now(),
  end_at timestamp with time zone,
  status text check (status in ('active','paused')) default 'active'
);
alter table public.promotions enable row level security;
create policy "promotions_read_all" on public.promotions for select using (true);

-- Create buckets in Supabase Storage manually:
-- providers-gallery (public) and providers-auth (private)
