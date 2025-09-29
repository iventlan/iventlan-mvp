// /app/[locale]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServer } from '@/lib/supabase/server'
import ReelsCarousel from '@/components/ReelsCarousel'

// Ads (MVP rotación ponderada + billboard)
import { getWeightedAd, getBillboardAds } from '@/lib/ads'
import SponsoredCard from '@/components/SponsoredCard'
import BillboardRotator from '@/components/BillboardRotator'

// Mascota
import pinabotWave from 'public/mascots/pinabot-wave.png'

export default async function Home({
  params,
}: {
  params: { locale: 'en' | 'es' }
}) {
  const locale = params.locale
  const isEn = locale === 'en'
  const supabase = createSupabaseServer()

  // PROMO (si existe, tiene prioridad sobre el ad rotado)
  const { data: promo } = await supabase
    .from('promotions')
    .select('provider_id, title_es, title_en, image_url, status')
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  let promoProvider:
    | {
        slug: string
        brand_name: string
        images: string[] | null
        category_slug: string
        city: string
      }
    | null = null

  if (promo?.provider_id) {
    const { data } = await supabase
      .from('providers')
      .select('slug, brand_name, images, category_slug, city')
      .eq('id', promo.provider_id)
      .maybeSingle()
    promoProvider = data ?? null
  }

  // DESTACADOS
  const { data: recs } = await supabase
    .from('providers')
    .select(
      'slug, brand_name, images, category_slug, city, price_min, verification_status'
    )
    .eq('verification_status', 'verified')
    .limit(4)

  // AD rotado (si NO hay promo activa)
  const weightedAd = promoProvider ? null : await getWeightedAd()

  // BILLBOARD (rotador tipo “hero carousel” con varias campañas)
  const billboardAds = await getBillboardAds(locale)

  // Inserta PROMO como primer slide del billboard (si existe)
  if (promoProvider && promo?.image_url) {
    billboardAds.unshift({
      id: 'promo-hero',
      image_url: promo.image_url!,
      headline:
        isEn ? promo.title_en ?? promo.title_es : promo.title_es ?? promo.title_en,
      cta_url: `/${locale}/proveedores/${promoProvider.slug}`,
    })
  }

  // CATEGORÍAS
  const cats = [
    { slug: 'salones', name: isEn ? 'Kids venues' : 'Salones infantiles', icon: '🏰' },
    { slug: 'decoracion', name: isEn ? 'Decor & balloons' : 'Decoración y globos', icon: '🎈' },
    { slug: 'dulces', name: isEn ? 'Candy bars' : 'Mesas de dulces', icon: '🍬' },
    { slug: 'pasteles', name: isEn ? 'Cakes' : 'Pasteles', icon: '🎂' },
    { slug: 'inflables', name: isEn ? 'Inflatables' : 'Inflables', icon: '🎮' },
    { slug: 'shows', name: isEn ? 'Shows & characters' : 'Shows y animación', icon: '🎭' },
    { slug: 'snacks', name: isEn ? 'Snack carts' : 'Carritos de snacks', icon: '🍿' },
    { slug: 'foto-video', name: isEn ? 'Photo & video' : 'Foto y video', icon: '📷' },
  ]

  return (
    <main>
      {/* HERO */}
      <section className="container mt-8">
        <div className="relative overflow-hidden bg-sprinkles p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <img
                src="/iventlan%20logo.svg"
                alt="Iventlan"
                className="mx-auto h-28 md:h-44 lg:h-56 w-auto drop-shadow-sm"
              />
            </div>

            <h1 className="text-[var(--ink)] text-4xl md:text-5xl font-semibold leading-tight">
              {isEn
                ? 'Find the perfect provider for your event'
                : 'Encuentra el proveedor perfecto para tu evento'}
            </h1>

            <p className="mt-3 text-lg text-brand-slate">
              {isEn
                ? 'Verified providers for kids parties, XV, weddings and social events — Mazatlán only (for now).'
                : 'Proveedores verificados para fiestas infantiles, XV años, bodas y eventos sociales — solo Mazatlán (por ahora).'}
            </p>

            <form
              method="get"
              action={`/${locale}/proveedores`}
              className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-center"
            >
              <input
                name="q"
                placeholder={isEn ? 'What do you need?' : '¿Qué necesitas para tu evento?'}
                className="h-12 w-full rounded-full border border-[var(--cloud)] bg-white px-5 shadow-sm outline-none focus:ring-2 focus:ring-[var(--brand-accent)] md:w-[360px]"
              />
              <select
                name="cat"
                defaultValue=""
                className="h-12 w-full rounded-full border border-[var(--cloud)] bg-white px-5 shadow-sm outline-none focus:ring-2 focus:ring-[var(--brand-accent)] md:w-[260px]"
              >
                <option value="" disabled>
                  {isEn ? 'Category' : 'Categoría'}
                </option>
                {cats.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="h-12 rounded-full bg-[var(--brand-primary)] px-6 font-semibold text-white hover:opacity-95"
              >
                {isEn ? 'Search' : 'Buscar'}
              </button>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/solicitud`}
                className="inline-flex h-12 items-center rounded-full bg-[var(--brand-primary)] px-6 font-semibold text-white hover:opacity-95"
              >
                {isEn ? 'Request quote' : 'Solicitar cotización'}
              </Link>
              <Link
                href={`/${locale}/proveedores`}
                className="inline-flex h-12 items-center rounded-full bg-[var(--brand-accent-100)] px-6 font-semibold text-[var(--ink)] hover:opacity-95"
              >
                {isEn ? 'Explore providers' : 'Explorar proveedores'}
              </Link>
            </div>
          </div>

          <div className="pointer-events-none absolute right-6 bottom-24 md:bottom-28 lg:bottom-40 hidden md:block">
            <Image
              src={pinabotWave}
              alt="Piñabot, la mascota de Iventlan, saludando"
              width={360}
              height={360}
              priority
              sizes="(min-width: 768px) 360px, 0px"
              className="animate-float"
            />
          </div>
        </div>
      </section>

      {/* SPONSOR EN HERO (Stoked Ideas) */}
      <section className="container mt-4">
        <SponsorCardHome locale={isEn ? 'en' : 'es'} />
      </section>

      {/* BILLBOARD ROTATOR (tipo Netflix/Disney) */}
      {billboardAds.length > 0 && (
        <section className="container mt-6">
          <BillboardRotator ads={billboardAds} locale={locale} />
        </section>
      )}

      {/* PATROCINADO */}
      <section className="container py-8">
        <h2 className="mb-3 text-sm font-medium text-brand-slate">
          {isEn ? 'Sponsored' : 'Patrocinado'}
        </h2>

        <ReelsCarousel />

        {promoProvider ? (
          <Link
            href={`/${locale}/proveedores/${promoProvider.slug}`}
            className="card grid grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]"
          >
            <img
              src={
                promo?.image_url ??
                promoProvider.images?.[0] ??
                'https://picsum.photos/seed/ad/800/600'
              }
              alt="ad"
              className="h-48 w-full object-cover md:h-full"
            />
            <div className="p-5">
              <div className="text-xs text-brand-slate">
                {isEn ? 'Sponsored' : 'Patrocinado'}
              </div>
              <div className="mt-1 text-lg font-medium">
                {isEn ? promo?.title_en ?? promo?.title_es : promo?.title_es ?? promo?.title_en}
              </div>
              <div className="mt-1 text-sm text-brand-slate">
                {promoProvider.brand_name} · {promoProvider.category_slug} · {promoProvider.city}
              </div>
            </div>
          </Link>
        ) : weightedAd ? (
          <SponsoredCard ad={weightedAd} label={isEn ? 'Sponsored' : 'Patrocinado'} />
        ) : (
          <div className="card p-5 text-sm text-brand-slate">
            {isEn ? 'Your ad could be here.' : 'Tu anuncio podría estar aquí.'}
          </div>
        )}
      </section>

      {/* RECOMENDADOS */}
      <section className="container pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEn ? 'Recommended for you' : 'Proveedores destacados'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {(recs ?? []).map((p: any) => (
            <Link
              key={p.slug}
              href={`/${locale}/proveedores/${p.slug}`}
              className="card overflow-hidden transition hover:shadow-cardHover"
            >
              <img
                src={p.images?.[0] ?? 'https://picsum.photos/seed/card/800/600'}
                alt={p.brand_name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <div className="font-medium">{p.brand_name}</div>
                <div className="text-xs text-brand-slate">
                  {p.category_slug} · {p.city}
                </div>
                {p.price_min != null && (
                  <div className="mt-1 text-sm">
                    {isEn ? 'From' : 'Desde'} ${p.price_min}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS POPULARES */}
      <section className="container pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEn ? 'Popular categories' : 'Categorías populares'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/proveedores?cat=${c.slug}`}
              className="card flex items-center gap-4 p-4 transition hover:shadow-cardHover"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-accent-100)]">
                {c.icon}
              </span>
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-brand-slate">
                  {isEn ? 'Mazatlán & nearby' : 'Mazatlán y alrededores'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ---------- componente: SponsorCardHome (hero) ---------- */
function SponsorCardHome({ locale }: { locale: 'es' | 'en' }) {
  const copy =
    locale === 'en'
      ? {
          eyebrow: 'Partner spotlight',
          title: 'Premium photo & video to boost your bookings',
          body: 'Use code iventlan25 to unlock an exclusive, limited discount with Stoked Ideas.',
          cta: 'Claim the Stoked Ideas offer',
          promo: 'Code: iventlan25',
          note: 'Limited-time partner deal for Iventlan providers.',
        }
      : {
          eyebrow: 'Patrocinado por Stoked Ideas',
          title: 'Fotos y videos premium para disparar tus reservas',
          body: 'Usa el código iventlan25 y obtén un descuento exclusivo y limitado con Stoked Ideas.',
          cta: 'Aprovechar la oferta de Stoked Ideas',
          promo: 'Código: iventlan25',
          note: 'Beneficio por tiempo limitado para proveedores de Iventlan.',
        }

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1f2937] to-[#0f172a] px-6 py-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.22em] text-white/70">
            {copy.eyebrow}
          </span>
          <h2 className="mt-1 text-xl md:text-2xl font-semibold">{copy.title}</h2>
          <p className="mt-1 text-sm text-white/85">{copy.body}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]">
            {copy.promo}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <a
            href="https://stokedideas.com/iventlan?utm_source=iventlan&utm_medium=referral&utm_campaign=iventlan25"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] shadow-md transition hover:scale-[1.02]"
          >
            {copy.cta}
          </a>
          <span className="text-xs text-white/70">{copy.note}</span>
        </div>
      </div>
    </section>
  )
}
