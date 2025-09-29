'use client'

import { I18nContext } from '@/lib/i18n'
import es from '@/messages/es.json'
import en from '@/messages/en.json'
import * as React from 'react'

export default function I18nProvider({
  locale,
  children,
}: {
  locale: 'es' | 'en'
  children: React.ReactNode
}) {
  const dict: any = locale === 'en' ? en : es

  const t = (k: string, vars?: Record<string, string | number>) => {
    const raw = dict[k] ?? k
    if (!vars) return raw
    return Object.keys(vars).reduce(
      (acc, key) => acc.replaceAll(`\${${key}}`, String(vars[key])),
      raw
    )
  }

  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  )
}
