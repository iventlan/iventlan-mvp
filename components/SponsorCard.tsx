'use client'

export default function SponsorCard({ locale }: { locale: 'es' | 'en' }) {
  const copy =
    locale === 'en'
      ? {
          eyebrow: 'Partner spotlight',
          title: 'Premium photo & video to boost your bookings',
          body:
            'Want scroll-stopping content to attract more clients on Iventlan and across your socials? Use code iventlan25 to unlock an exclusive, limited discount with Stoked Ideas.',
          cta: 'Claim the Stoked Ideas offer',
          promo: 'Code: iventlan25',
          note: 'Limited-time partner deal for Iventlan providers.',
          url:
            'https://stokedideas.com/iventlan?utm_source=iventlan&utm_medium=referral&utm_campaign=iventlan25',
        }
      : {
          eyebrow: 'Patrocinado por Stoked Ideas',
          title: 'Fotos y videos premium para disparar tus reservas',
          body:
            '¿Quieres contenido que detenga el scroll y atraiga más clientes en Iventlan y tus redes? Usa el código iventlan25 y obtén un descuento exclusivo y limitado con Stoked Ideas.',
          cta: 'Aprovechar la oferta de Stoked Ideas',
          promo: 'Código: iventlan25',
          note: 'Beneficio por tiempo limitado para proveedores de Iventlan.',
          url:
            'https://stokedideas.com/iventlan?utm_source=iventlan&utm_medium=referral&utm_campaign=iventlan25',
        }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1f2937] to-[#0f172a] px-6 py-7 text-white shadow-xl">
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-white/70">
            {copy.eyebrow}
          </span>
          <h2 className="text-2xl font-semibold">{copy.title}</h2>
          <p className="text-sm text-white/85">{copy.body}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]">
            {copy.promo}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <a
            href={copy.url}
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
