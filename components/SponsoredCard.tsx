// /components/SponsoredCard.tsx
'use client'

type Props = {
  ad: {
    image_url: string | null
    headline: string | null
    cta_url: string | null
  }
  label?: string // "Patrocinado" / "Sponsored"
}

export default function SponsoredCard({ ad, label = 'Patrocinado' }: Props) {
  if (!ad) return null
  const img = ad.image_url || 'https://picsum.photos/seed/ad/1200/600'
  const title = ad.headline || 'Promoción destacada'
  const href = ad.cta_url || '#'

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block card overflow-hidden hover:shadow-cardHover transition"
    >
      <div className="relative">
        <img src={img} alt={title} className="w-full h-48 md:h-56 object-cover" />
      </div>
      <div className="p-4">
        <div className="text-xs text-brand-slate">{label}</div>
        <div className="mt-1 text-lg font-medium">{title}</div>
      </div>
    </a>
  )
}
