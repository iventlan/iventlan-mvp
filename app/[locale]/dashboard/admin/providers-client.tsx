'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'

type VerificationStatus = 'pending' | 'verified' | 'needs_more_info' | 'rejected'

type ProviderRow = {
  id: number
  brand_name: string | null
  slug: string | null
  category_slug: string | null
  city: string | null
  verification_status: VerificationStatus | null
  created_at: string
}

export default function AdminProvidersClient({ locale }: { locale: 'es' | 'en' }) {
  const isEn = locale === 'en'
  const [items, setItems] = useState<ProviderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'' | VerificationStatus>('')

  async function load() {
    setLoading(true)
    let query = supabaseBrowser
      .from('providers')
      .select('id, brand_name, slug, category_slug, city, verification_status, created_at')
      .order('created_at', { ascending: false })

    // Si quieres filtrar en servidor, descomenta estas líneas:
    // if (status) query = query.eq('verification_status', status)
    // if (q) query = query.ilike('brand_name', `%${q}%`)

    const { data, error } = await query
    if (!error && data) setItems(data as ProviderRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const t = (q || '').trim().toLowerCase()
    return items.filter(p => {
      const okStatus = !status || (p.verification_status ?? 'pending') === status
      const haystack = `${p.brand_name ?? ''} ${p.slug ?? ''} ${p.city ?? ''}`.toLowerCase()
      const okQ = !t || haystack.includes(t)
      return okStatus && okQ
    })
  }, [items, q, status])

  async function setVerification(id: number, next: VerificationStatus) {
    // Tipado seguro para la actualización (verified_at es opcional en tu tabla)
    const payload: Record<string, any> = {
      verification_status: next,
      verified_at: next === 'verified' ? new Date().toISOString() : null,
    }

    const { error } = await supabaseBrowser
      .from('providers')
      .update(payload)
      .eq('id', id)

    if (!error) load()
  }

  async function remove(id: number) {
    if (!confirm(isEn ? 'Delete provider?' : '¿Eliminar proveedor?')) return
    const { error } = await supabaseBrowser.from('providers').delete().eq('id', id)
    if (!error) load()
  }

  return (
    <div className="container py-8 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">
          {isEn ? 'Admin · Providers' : 'Admin · Proveedores'}
        </h1>

        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isEn ? 'Search by name/slug/city' : 'Buscar por nombre/slug/ciudad'}
            className="h-10 w-64 rounded-lg border border-[var(--cloud)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-lg border border-[var(--cloud)] bg-white px-3 text-sm"
          >
            <option value="">{isEn ? 'All statuses' : 'Todos los estados'}</option>
            <option value="pending">{isEn ? 'Pending' : 'Pendiente'}</option>
            <option value="verified">{isEn ? 'Verified' : 'Verificado'}</option>
            <option value="needs_more_info">{isEn ? 'Needs info' : 'Pedir info'}</option>
            <option value="rejected">{isEn ? 'Rejected' : 'Rechazado'}</option>
          </select>
          <button onClick={load} className="btn btn--sm">
            {isEn ? 'Refresh' : 'Actualizar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div>{isEn ? 'Loading…' : 'Cargando…'}</div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="text-sm">
                <div className="font-medium flex items-center gap-2">
                  <span>{p.brand_name ?? '—'}</span>
                  {p.verification_status === 'verified' && (
                    <span className="text-emerald-700">✔</span>
                  )}
                  <span className="rounded-full bg-[var(--brand-accent-100)] px-2 py-0.5 text-xs">
                    {p.verification_status ?? 'pending'}
                  </span>
                </div>
                <div className="text-brand-slate">
                  {p.category_slug ?? '—'} · {p.city ?? '—'} · /proveedores/{p.slug ?? '—'}
                </div>
                <div className="text-[11px] text-brand-slate mt-1">
                  {new Date(p.created_at).toLocaleString()}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn"
                  onClick={() => setVerification(p.id, 'verified')}
                  style={{ background: '#3F9871', color: '#fff' }}
                >
                  {isEn ? 'Verify' : 'Verificar'}
                </button>
                <button
                  className="btn"
                  onClick={() => setVerification(p.id, 'needs_more_info')}
                  style={{ background: '#F6C544' }}
                >
                  {isEn ? 'Ask info' : 'Pedir info'}
                </button>
                <button
                  className="btn"
                  onClick={() => setVerification(p.id, 'rejected')}
                  style={{ background: '#F47980', color: '#fff' }}
                >
                  {isEn ? 'Reject' : 'Rechazar'}
                </button>
                <button
                  className="btn"
                  onClick={() => remove(p.id)}
                  style={{ background: '#8D6DC2', color: '#fff' }}
                >
                  {isEn ? 'Delete' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="text-sm text-brand-slate">
              {isEn ? 'No providers found.' : 'No se encontraron proveedores.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
