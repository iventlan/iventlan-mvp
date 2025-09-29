// app/[locale]/proveedores/[slug]/page.tsx
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import SponsorCard from '@/components/SponsorCard'

export const dynamic = 'force-dynamic'

function wa(num?: string, text?: string) {
  if (!num) return null
  const digits = num.replace(/\D/g, '')
  const q = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${digits}${q}`
}

export default async function ProviderDetail({
  params,
}: {
  params: { locale: 'es' | 'en'; slug: string }
}) {
  const supabase = createSupabaseServer()

  const { data: provider, error } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !provider) {
    return <div className="container py-8">No encontrado</div>
  }

  const waLink = wa(
    provider.contact_whatsapp,
    `Hola ${provider.brand_name}, vi tu perfil en Iventlan y me interesa cotizar.`
  )

  return (
    <div className="container py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna izquierda */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card overflow-hidden">
          <div className="grid grid-cols-2 gap-2 p-2 bg-brand-cloud/30">
            {(provider.images?.length ? provider.images : ['https://picsum.photos/seed/one/800/600'])
              .slice(0, 4)
              .map((src: string, i: number) => (
                <img
                  key={i}
                  src={src}
                  alt={provider.brand_name}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              ))}
          </div>

          <div className="p-4">
            <h1 className="text-2xl font-semibold">{provider.brand_name}</h1>
            <div className="text-sm text-brand-slate">
              {provider.category_slug} · {provider.city}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {provider.price_min != null ? (
                <span className="badge">Desde ${provider.price_min}</span>
              ) : (
                <span className="badge">Precio a solicitud</span>
              )}
              {provider.verification_status === 'verified' && (
                <span className="badge bg-emerald-50 text-emerald-700">Verificado</span>
              )}
            </div>

            <p className="mt-4 whitespace-pre-line">{provider.short_bio_es}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card p-3">
                <div className="text-xs text-brand-slate">Tiempo de respuesta</div>
                <div className="font-medium">
                  {provider.response_time_min ?? 30} min
                </div>
              </div>
              <div className="card p-3 md:col-span-2">
                <div className="text-xs text-brand-slate">Políticas de servicio</div>
                <div className="text-sm text-brand-ink">{provider.sla_es}</div>
              </div>
            </div>

            {provider.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {provider.tags.map((t: string, i: number) => (
                  <span key={i} className="badge">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ⬇️ Tarjeta de Sponsor: Stoked Ideas */}
        <SponsorCard locale={params.locale} />
      </div>

      {/* Columna derecha */}
      <aside className="space-y-4">
        <div className="card p-4">
          <div className="font-medium mb-2">Contacto</div>
          <div className="space-y-1 text-sm">
            {provider.contact_name && <div>{provider.contact_name}</div>}
            {provider.contact_phone && (
              <div>
                Tel:{' '}
                <a className="text-brand-green" href={`tel:${provider.contact_phone}`}>
                  {provider.contact_phone}
                </a>
              </div>
            )}
            {provider.contact_email && (
              <div>
                Email:{' '}
                <a className="text-brand-green" href={`mailto:${provider.contact_email}`}>
                  {provider.contact_email}
                </a>
              </div>
            )}
            {provider.contact_whatsapp && waLink && (
              <div>
                WhatsApp:{' '}
                <a className="text-brand-green" href={waLink} target="_blank">
                  Abrir chat
                </a>
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-2">
              {provider.instagram_url && (
                <a className="text-sm underline" href={provider.instagram_url} target="_blank">
                  Instagram
                </a>
              )}
              {provider.facebook_url && (
                <a className="text-sm underline" href={provider.facebook_url} target="_blank">
                  Facebook
                </a>
              )}
              {provider.website_url && (
                <a className="text-sm underline" href={provider.website_url} target="_blank">
                  Sitio web
                </a>
              )}
            </div>
          </div>
        </div>

        <Link href={`/${params.locale}/solicitud`} className="btn btn-primary w-full">
          Solicitar cotización
        </Link>
      </aside>
    </div>
  )
}
