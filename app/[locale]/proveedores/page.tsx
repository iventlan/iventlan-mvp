import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ProvidersIndex({ params }:{params:{locale:string}}){
  const supabase = createSupabaseServer()
  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .eq('verification_status', 'verified')
    .limit(60)

  const { data: promos } = await supabase
    .from('promotions')
    .select('*, providers!inner(slug, brand_name)')
    .eq('status', 'active')
    .limit(5)

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Proveedores</h1>

      {promos && promos.length > 0 && (
        <div className="mb-6">
          <div className="badge">Patrocinado / Sponsored</div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.slice(0,1).map((p:any) => (
              <Link key={p.id} href={`/${params.locale}/proveedores/${p.providers.slug}`} className="card overflow-hidden">
                <div className="relative h-40 bg-brand-cloud">
                  <img src={p.image_url || 'https://picsum.photos/seed/ad/800/600'} alt="ad" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-sm text-brand-slate">Patrocinado</div>
                  <div className="font-medium">{p.title_es || p.title_en || p.providers.brand_name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(providers||[]).map((p:any)=>(
          <Link key={p.id} href={`/${params.locale}/proveedores/${p.slug}`} className="card overflow-hidden">
            <div className="relative h-40 bg-brand-cloud">
              <img src={(p.images?.[0]) || 'https://picsum.photos/seed/placeholder/800/600'} alt={p.brand_name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="font-medium">{p.brand_name}</div>
              <div className="text-sm text-brand-slate">{p.category_slug} · {p.city}</div>
              {p.price_min != null ? (
                <div className="text-sm mt-1">Desde ${p.price_min}</div>
              ) : (
                <div className="text-sm mt-1 badge">Precio a solicitud</div>
              )}
              {p.verification_status === 'verified' && (
                <div className="mt-2 inline-block text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">Verificado</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
