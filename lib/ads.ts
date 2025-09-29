// /lib/ads.ts
import { createSupabaseServer } from '@/lib/supabase/server'

export type Ad = {
  id: string
  provider_id: number
  package: 'starter' | 'boost' | 'top'
  target_category: string | null
  target_city: string | null
  start_at: string
  end_at: string
  status: 'active' | 'paused' | 'ended' | 'pending_approval'
  image_url: string | null
  headline: string | null
  cta_url: string | null
  weight: number
}

// --- Selección ponderada de 1 ad ---
export async function getWeightedAd(opts?: {
  category?: string | null
  city?: string | null
}): Promise<Ad | null> {
  const supabase = createSupabaseServer()
  const { data, error } = await supabase.from('active_ads').select('*')
  if (error || !data?.length) return null

  const pool = data.filter((a) => {
    const okCat = !opts?.category || !a.target_category || a.target_category === opts.category
    const okCity = !opts?.city || !a.target_city || a.target_city === opts.city
    return okCat && okCity
  })
  if (!pool.length) return null

  const total = pool.reduce((acc, a) => acc + (a.weight || 1), 0)
  let r = Math.random() * total
  for (const ad of pool) {
    r -= (ad.weight || 1)
    if (r <= 0) return ad as Ad
  }
  return pool[0] as Ad
}

// --- Billboard: varios ads mezclados por peso ---
export async function getBillboardAds(
  _locale: 'es' | 'en',
  take: number = 8
): Promise<Array<{ id: string; image_url: string | null; headline: string | null; cta_url: string | null }>> {
  const supabase = createSupabaseServer()
  const { data, error } = await supabase
    .from('active_ads')
    .select('id, image_url, headline, cta_url, weight')
  if (error || !data?.length) return []

  // mezcla ponderada simple
  const weightedPool: typeof data = []
  for (const item of data) {
    const w = Math.max(1, item.weight ?? 1)
    for (let i = 0; i < w; i++) weightedPool.push(item)
  }
  // shuffle
  for (let i = weightedPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[weightedPool[i], weightedPool[j]] = [weightedPool[j], weightedPool[i]]
  }
  // únicos
  const seen = new Set<string>()
  const out: Array<{ id: string; image_url: string | null; headline: string | null; cta_url: string | null }> = []
  for (const it of weightedPool) {
    if (!seen.has(it.id)) {
      seen.add(it.id)
      out.push({ id: it.id, image_url: it.image_url, headline: it.headline, cta_url: it.cta_url })
      if (out.length >= take) break
    }
  }
  return out
}
