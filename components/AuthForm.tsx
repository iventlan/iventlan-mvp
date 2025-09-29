'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function AuthForm() {
  const router = useRouter()
  const params = useParams<{ locale: 'es' | 'en' }>()
  const locale = params.locale
  const isEn = locale === 'en'

  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  // Refresca la UI y sincroniza cookies cuando cambie el estado de sesión (OAuth/magic link)
  React.useEffect(() => {
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await fetch('/auth/callback', { method: 'POST' })
        router.replace(`/${locale}/dashboard`)
        router.refresh()
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [router, locale])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'signin') {
        // Login con contraseña: la sesión queda inmediata
        const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
        if (error) throw error

        // Sincroniza cookies del servidor para layouts/SSR
        await fetch('/auth/callback', { method: 'POST' })
        router.replace(`/${locale}/dashboard`)
        router.refresh()
      } else {
        // Registro con confirmación por email (enlace mágico)
        const redirectTo = `${location.origin}/auth/callback?next=/${locale}/dashboard`
        const { error } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        })
        if (error) throw error
        setMessage(
          isEn
            ? 'Check your inbox to confirm your email.'
            : 'Revisa tu correo para confirmar tu cuenta.'
        )
      }
    } catch (err: any) {
      setMessage(err?.message ?? 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4 inline-flex rounded-full bg-[var(--brand-accent-100)] p-1">
        <button
          className={`h-9 rounded-full px-4 text-sm ${mode === 'signin' ? 'bg-white shadow font-medium' : ''}`}
          onClick={() => setMode('signin')}
          type="button"
        >
          {isEn ? 'Sign in' : 'Iniciar sesión'}
        </button>
        <button
          className={`h-9 rounded-full px-4 text-sm ${mode === 'signup' ? 'bg-white shadow font-medium' : ''}`}
          onClick={() => setMode('signup')}
          type="button"
        >
          {isEn ? 'Create account' : 'Crear cuenta'}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder={isEn ? 'Email' : 'Correo electrónico'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-xl border px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
        />
        <input
          type="password"
          required
          placeholder={isEn ? 'Password (min 6 chars)' : 'Contraseña (mín. 6)'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-xl border px-4 outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
        />

        <button
          disabled={loading}
          className="h-11 w-full rounded-xl bg-[var(--brand-primary)] text-white font-semibold hover:opacity-95 disabled:opacity-50"
        >
          {loading
            ? isEn ? 'Processing…' : 'Procesando…'
            : mode === 'signin'
              ? isEn ? 'Sign in' : 'Iniciar sesión'
              : isEn ? 'Create account' : 'Crear cuenta'}
        </button>
      </form>

      {message && <p className="mt-3 text-sm">{message}</p>}

      <div className="mt-4 text-xs text-brand-slate">
        {isEn
          ? 'After signing in you can complete your provider registration in the dashboard.'
          : 'Después de iniciar sesión podrás completar tu registro de proveedor en el dashboard.'}
      </div>
    </div>
  )
}
