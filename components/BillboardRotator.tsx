// components/BillboardRotator.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Ad = {
  id: string
  headline: string | null
  subheadline?: string | null
  image_url?: string | null
  video_url?: string | null
  cta_url?: string | null
  cta_label?: string | null
  media_type?: 'image'|'video'|null
}

export default function BillboardRotator({
  ads,
  locale = 'es',
  intervalMs = 6000,
}: {
  ads: Ad[]
  locale?: 'es'|'en'
  intervalMs?: number
}) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const count = ads.length

  React.useEffect(() => {
    if (count === 0 || paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count)
      // opcional: fetch('/api/ads/impression', { method:'POST', body: JSON.stringify({ id: ads[(i+1)%count].id }) })
    }, intervalMs)
    return () => clearInterval(id)
  }, [count, ads, paused, intervalMs])

  if (!count) return null
  const ad = ads[index]

  return (
    <section
      className="container mt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={locale==='en' ? 'Featured sponsors' : 'Patrocinadores destacados'}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] text-white">
        {/* Media */}
        <div className="relative h-[44vw] max-h-[420px] w-full">
          {ad.media_type === 'video' && ad.video_url ? (
            <video
              className="h-full w-full object-cover"
              src={ad.video_url}
              autoPlay
              muted
              playsInline
              loop
              poster={ad.image_url ?? undefined}
            />
          ) : (
            <Image
              src={ad.image_url || 'https://picsum.photos/seed/billboard/1600/900'}
              alt={ad.headline ?? 'sponsor'}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          {/* degradé para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Texto + CTA */}
        <div className="absolute inset-0 flex items-end">
          <div className="p-5 sm:p-8 w-full">
            {ad.headline && (
              <h2 className="text-2xl sm:text-3xl font-semibold drop-shadow">
                {ad.headline}
              </h2>
            )}
            {ad.subheadline && (
              <p className="mt-1 text-white/85 max-w-2xl drop-shadow">
                {ad.subheadline}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3">
              {ad.cta_url && (
                <Link
                  href={ad.cta_url}
                  target="_blank"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] shadow-md hover:scale-[1.02]"
                  onClick={()=>{
                    // opcional: fetch('/api/ads/click',{ method:'POST', body: JSON.stringify({ id: ad.id }) })
                  }}
                >
                  {ad.cta_label || (locale==='en' ? 'Learn more' : 'Saber más')}
                </Link>
              )}
              {/* controles */}
              <div className="ml-auto hidden md:flex items-center gap-2">
                <button
                  aria-label={locale==='en'?'Previous':'Anterior'}
                  className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20"
                  onClick={()=> setIndex(i=> (i-1+count)%count)}
                >‹</button>
                <button
                  aria-label={paused ? (locale==='en'?'Play':'Reanudar') : (locale==='en'?'Pause':'Pausar')}
                  className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20"
                  onClick={()=> setPaused(p=>!p)}
                >{paused?'▶':'⏸'}</button>
                <button
                  aria-label={locale==='en'?'Next':'Siguiente'}
                  className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20"
                  onClick={()=> setIndex(i=> (i+1)%count)}
                >›</button>
              </div>
            </div>

            {/* Indicadores */}
            <div className="mt-3 flex gap-2">
              {ads.map((_, i) => (
                <button
                  key={i}
                  onClick={()=> setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i===index ? 'w-8 bg-white' : 'w-3 bg-white/40'}`}
                  aria-label={(locale==='en'?'Go to slide':'Ir al slide') + ` ${i+1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
