'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner({ locale }: { locale: 'es' | 'en' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // si no existe preferencia, mostramos el banner
    const v = localStorage.getItem('cookie-consent')
    if (!v) setOpen(true)
  }, [])

  if (!open) return null

  const copy =
    locale === 'en'
      ? {
          text: (
            <>
              We use cookies for authentication, preferences, and analytics. See our{' '}
              <a href="/en/legal/privacidad" className="underline">Privacy Notice</a>.
            </>
          ),
          accept: 'Accept',
          reject: 'Reject',
        }
      : {
          text: (
            <>
              Usamos cookies para autenticación, preferencias y analítica. Consulta nuestro{' '}
              <a href="/es/legal/privacidad" className="underline">Aviso de privacidad</a>.
            </>
          ),
          accept: 'Aceptar',
          reject: 'Rechazar',
        }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto m-4 max-w-3xl rounded-2xl border bg-white p-4 shadow-xl">
        <p className="text-sm text-slate-700">
          {copy.text}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            className="rounded-full bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            onClick={() => { localStorage.setItem('cookie-consent', 'accepted'); setOpen(false) }}
          >
            {copy.accept}
          </button>
          <button
            className="rounded-full border px-4 py-2 text-sm"
            onClick={() => { localStorage.setItem('cookie-consent', 'rejected'); setOpen(false) }}
          >
            {copy.reject}
          </button>
        </div>
      </div>
    </div>
  )
}
