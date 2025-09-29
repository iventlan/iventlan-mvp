'use client'

import * as React from 'react'
import Link from 'next/link'

type Item = {
  id: string
  image_url: string | null
  headline: string | null
  cta_url: string | null
}

export default function SponsoredRail({ items, label }: { items: Item[]; label: string }) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [items.length])

  if (!items.length) return null

  return (
    <section className="container mt-6">
      <div className="mb-2 text-sm font-medium text-brand-slate">{label}</div>

      <div className="relative overflow-hidden rounded-2xl shadow-card bg-white">
        {/* slide actual */}
        <div className="relative h-[220px] w-full md:h-[320px]">
          <img
            src={items[index]?.image_url ?? 'https://picsum.photos/seed/promo/1200/600'}
            alt={items[index]?.headline ?? 'promo'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute left-5 top-5 text-white max-w-[60%]">
            <div className="text-xs uppercase tracking-widest opacity-80">{label}</div>
            <h3 className="mt-1 text-2xl md:text-3xl font-semibold leading-tight">
              {items[index]?.headline ?? 'Tu marca destacada aquí'}
            </h3>
            {items[index]?.cta_url && (
              <Link
                href={items[index]!.cta_url!}
                target="_blank"
                className="mt-3 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--ink)]"
              >
                Más detalles
              </Link>
            )}
          </div>
        </div>

        {/* dots */}
        {items.length > 1 && (
          <div className="absolute bottom-3 right-4 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
