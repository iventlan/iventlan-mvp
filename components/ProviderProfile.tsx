'use client'

import * as React from 'react'

type Img = { url: string; alt?: string }
type Contact = {
  name?: string
  phone?: string            // e.g. +526699127968
  email?: string
  instagram?: string        // profile url
  whatsapp?: string         // full wa.me or tel, si no estÃ¡ uso phone
}

export type ProviderProfileProps = {
  locale: 'es' | 'en'
  slug: string
  brandName: string
  categoryLabel: string
  city: string
  verified?: boolean
  priceFrom?: number
  summary?: string
  badges?: string[]         // ej. ["Top Rated", "Pago con tarjeta"]
  responseTimeMin?: number
  serviceNotes?: string     // polÃ­ticas de servicio breves
  tags?: string[]
  images: Img[]             // 3â€“10 imÃ¡genes
  contact: Contact
  quoteHref: string         // ruta a tu flujo de cotizaciÃ³n, ej "/es/solicitud?prov=slug"
}

export default function ProviderProfile(p: ProviderProfileProps) {
  const [lightbox, setLightbox] = React.useState<{open:boolean; index:number}>({open:false, index:0})
  const t = (es: string, en: string) => (p.locale === 'en' ? en : es)

  const onOpen = (i:number) => setLightbox({open:true, index:i})
  const onClose = () => setLightbox({open:false, index:0})
  const next = () => setLightbox(s => ({...s, index: (s.index + 1) % p.images.length}))
  const prev = () => setLightbox(s => ({...s, index: (s.index - 1 + p.images.length) % p.images.length}))

  const wa = p.contact.whatsapp || (p.contact.phone ? `https://wa.me/${p.contact.phone.replace(/\D/g,'')}` : undefined)
  const tel = p.contact.phone ? `tel:${p.contact.phone}` : undefined
  const mail = p.contact.email ? `mailto:${p.contact.email}` : undefined

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Columna principal */}
      <div>
        {/* GalerÃ­a */}
        <GalleryGrid images={p.images} onOpen={onOpen} />

        {/* Encabezado */}
        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold">{p.brandName}</h1>
            {p.verified && (
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-xs font-medium">
                {t('Verificado', 'Verified')}
              </span>
            )}
            {p.badges?.map(b => (
              <span key={b} className="rounded-full bg-[var(--brand-accent-100)] text-[var(--ink)] px-2.5 py-0.5 text-xs">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-1 text-sm text-brand-slate">
            {p.categoryLabel} Â· {p.city}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {p.priceFrom != null && (
              <div className="text-lg font-medium">
                {t('Desde', 'From')} ${p.priceFrom}
              </div>
            )}
            <div className="h-4 w-px bg-[var(--cloud)]" />
            <div className="text-sm text-brand-slate">
              {p.summary}
            </div>
          </div>

          {/* CTA principal */}
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={p.quoteHref}
              className="inline-flex h-11 items-center rounded-full bg-[var(--brand-primary)] px-6 font-semibold text-white hover:opacity-95"
            >
              {t('Solicitar cotizaciÃ³n', 'Request quote')}
            </a>

            {wa && (
              <a
                href={wa}
                target="_blank" rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full bg-[#25D366] px-4 text-white font-semibold"
              >
                WhatsApp
              </a>
            )}
            {tel && (
              <a
                href={tel}
                className="inline-flex h-11 items-center rounded-full border px-4 font-medium"
              >
                {t('Llamar', 'Call')}
              </a>
            )}
            <button
              className="inline-flex h-11 items-center rounded-full border px-4 font-medium"
              onClick={() => navigator?.share?.({ url: location.href, title: p.brandName }).catch(()=>{})}
            >
              {t('Compartir', 'Share')}
            </button>
          </div>
        </header>

        <SponsorCard locale={p.locale} />

        {/* Highlights */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {p.responseTimeMin != null && (
            <InfoCard
              title={t('Tiempo de respuesta', 'Avg. response time')}
              value={`${p.responseTimeMin} ${t('min', 'min')}`}
            />
          )}
          {p.serviceNotes && (
            <InfoCard
              title={t('PolÃ­ticas de servicio', 'Service notes')}
              value={p.serviceNotes}
            />
          )}
        </div>

        {/* Tags */}
        {!!p.tags?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map(tag => (
              <span key={tag} className="rounded-full bg-white border px-3 py-1 text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Columna lateral (contacto + CTAs) */}
      <aside className="lg:sticky lg:top-20 h-fit">
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-2">{t('Contacto', 'Contact')}</h3>
          <ul className="space-y-1 text-sm">
            {p.contact.name && <li className="font-medium">{p.contact.name}</li>}
            {p.contact.phone && <li>Tel: {p.contact.phone}</li>}
            {p.contact.email && <li>Email: {p.contact.email}</li>}
            {p.contact.instagram && (
              <li>
                <a href={p.contact.instagram} target="_blank" rel="noreferrer" className="underline">
                  Instagram
                </a>
              </li>
            )}
          </ul>

          <div className="mt-3 grid gap-2">
            <a
              href={p.quoteHref}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--brand-primary)] px-6 font-semibold text-white hover:opacity-95"
            >
              {t('Solicitar cotizaciÃ³n', 'Request quote')}
            </a>
            {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp</a>}
            {tel && <a href={tel} className="btn-secondary">{t('Llamar', 'Call')}</a>}
            {mail && <a href={mail} className="btn-secondary">Email</a>}
          </div>
        </div>
      </aside>

      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <button aria-label="close" className="absolute right-4 top-4 text-white text-2xl">âœ•</button>
          <button
            onClick={(e)=>{ e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl px-3"
            aria-label={t('Anterior', 'Previous')}
          >
            â€¹
          </button>
          <button
            onClick={(e)=>{ e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl px-3"
            aria-label={t('Siguiente', 'Next')}
          >
            â€º
          </button>

          <div className="absolute inset-0 grid place-items-center p-4" onClick={(e)=>e.stopPropagation()}>
            <img
              src={p.images[lightbox.index]?.url}
              alt={p.images[lightbox.index]?.alt ?? p.brandName}
              className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------- sub-componentes ---------- */

function SponsorCard({ locale }:{ locale:'es'|'en' }) {
  const copy = locale === 'en'
    ? {
        eyebrow: 'Partner spotlight',
        title: 'Premium photo & video to boost your bookings',
        body: 'Want scroll-stopping content to attract more clients on Iventlan and across your social channels? Use code iventlan25 to unlock an exclusive, limited discount with Stoked Ideas.',
        cta: 'Claim the Stoked Ideas offer',
        promo: 'Code: iventlan25',
        note: 'Limited-time partner deal for Iventlan providers.'
      }
    : {
        eyebrow: 'Patrocinado por Stoked Ideas',
        title: 'Fotos y videos premium para disparar tus reservas',
        body: 'Si quieres contenido que atrape miradas en Iventlan y en tus redes, usa el código iventlan25 y aprovecha un descuento exclusivo y por tiempo limitado con Stoked Ideas.',
        cta: 'Aprovecha la oferta de Stoked Ideas',
        promo: 'Código: iventlan25',
        note: 'Beneficio exclusivo para proveedores de Iventlan. Cupo limitado.'
      }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1f2937] to-[#0f172a] px-6 py-7 text-white shadow-xl">
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-white/70">{copy.eyebrow}</span>
          <h2 className="text-2xl font-semibold">{copy.title}</h2>
          <p className="text-sm text-white/85">{copy.body}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]">{copy.promo}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <a
            href="https://stokedideas.com/iventlan?utm_source=iventlan&utm_medium=referral&utm_campaign=iventlan25"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] shadow-lg transition hover:scale-[1.02]"
          >
            {copy.cta}
          </a>
          <span className="text-xs text-white/70">{copy.note}</span>
        </div>
      </div>
    </section>
  )
}

function GalleryGrid({ images, onOpen }:{ images: Img[]; onOpen:(i:number)=>void }) {
  // layout: 1 grande + 4 mini; si hay mÃ¡s, el Ãºltimo muestra â€œ+Nâ€
  const primary = images[0]
  const thumbs = images.slice(1, 5)
  const extra = Math.max(0, images.length - 5)

  return (
    <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
      {/* grande */}
      <button
        onClick={()=> onOpen(0)}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[var(--cloud)]"
        aria-label="Abrir imagen"
      >
        {primary && (
          <img
            src={primary.url}
            alt={primary.alt ?? ''}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </button>

      {/* mini-grid */}
      <div className="grid grid-cols-2 gap-2">
        {thumbs.map((img, i) => (
          <button
            key={img.url}
            onClick={()=> onOpen(i+1)}
            className="relative aspect-[1/1] overflow-hidden rounded-xl bg-[var(--cloud)]"
            aria-label="Abrir imagen"
          >
            <img
              src={img.url}
              alt={img.alt ?? ''}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </button>
        ))}
        {extra > 0 && (
          <button
            onClick={()=> onOpen(4)}
            className="relative grid place-items-center aspect-[1/1] rounded-xl bg-black/50 text-white text-lg font-medium"
          >
            +{extra}
          </button>
        )}
      </div>
    </div>
  )
}

function InfoCard({ title, value }:{ title:string; value:string }) {
  const [open, setOpen] = React.useState(false)
  const short = value.length > 90 ? value.slice(0, 90) + 'â€¦' : value
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-brand-slate">{title}</div>
      <div className="mt-1 text-sm">
        {open ? value : short}{' '}
        {value.length > 90 && (
          <button onClick={()=>setOpen(!open)} className="underline">
            {open ? 'ver menos' : 'ver mÃ¡s'}
          </button>
        )}
      </div>
    </div>
  )
}

