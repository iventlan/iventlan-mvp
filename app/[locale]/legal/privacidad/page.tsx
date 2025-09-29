// /app/[locale]/legal/privacidad/page.tsx
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: { params: { locale: 'es' | 'en' } }): Promise<Metadata> {
  const isEn = params.locale === 'en'
  return {
    title: isEn ? 'Privacy Notice — Iventlan' : 'Aviso de Privacidad — Iventlan',
    description: isEn
      ? 'How we collect, use, and protect your data on Iventlan.'
      : 'Cómo recopilamos, usamos y protegemos tus datos en Iventlan.',
  }
}

export default function PrivacyPage({ params }: { params: { locale: 'es' | 'en' } }) {
  const isEn = params.locale === 'en'
  return (
    <main className="container py-10 prose prose-slate max-w-3xl">
      <h1>{isEn ? 'Privacy Notice' : 'Aviso de Privacidad'}</h1>
      <p className="lead">
        {isEn
          ? 'This document explains how Iventlan collects, uses, shares and protects your personal data.'
          : 'Este documento explica cómo Iventlan recopila, usa, comparte y protege tus datos personales.'}
      </p>

      <h2>{isEn ? 'What we collect' : 'Qué datos recopilamos'}</h2>
      <ul>
        <li>{isEn ? 'Account info (name, email, phone).' : 'Información de cuenta (nombre, correo, teléfono).'}</li>
        <li>{isEn ? 'Provider profile data and media.' : 'Datos del perfil de proveedor y medios.'}</li>
        <li>{isEn ? 'Usage and analytics (cookies).' : 'Uso y analítica (cookies).'}</li>
      </ul>

      <h2>{isEn ? 'How we use data' : 'Cómo usamos los datos'}</h2>
      <ul>
        <li>{isEn ? 'To operate the service and display profiles.' : 'Para operar el servicio y mostrar perfiles.'}</li>
        <li>{isEn ? 'To contact you about quotes or support.' : 'Para contactarte sobre cotizaciones o soporte.'}</li>
        <li>{isEn ? 'To improve features and prevent fraud.' : 'Para mejorar funciones y prevenir fraude.'}</li>
      </ul>

      <h2>{isEn ? 'Sharing' : 'Compartición'}</h2>
      <p>
        {isEn
          ? 'We may share data with service providers (e.g., hosting, payments) under contracts and only as needed.'
          : 'Podemos compartir datos con prestadores de servicios (p. ej., hosting, pagos) bajo contrato y solo cuando sea necesario.'}
      </p>

      <h2>{isEn ? 'Your rights' : 'Tus derechos'}</h2>
      <p>
        {isEn
          ? 'You can access, correct or delete your data. Contact us at support@iventlan.com.'
          : 'Puedes acceder, corregir o eliminar tus datos. Contáctanos en support@iventlan.com.'}
      </p>

      <h2>{isEn ? 'Cookies' : 'Cookies'}</h2>
      <p>
        {isEn
          ? 'We use necessary cookies and, with consent, analytics/marketing cookies.'
          : 'Usamos cookies necesarias y, con tu consentimiento, cookies de analítica/marketing.'}
      </p>

      <h2>{isEn ? 'Changes' : 'Cambios'}</h2>
      <p>
        {isEn
          ? 'We may update this notice. We will post the new effective date.'
          : 'Podemos actualizar este aviso. Publicaremos la nueva fecha de vigencia.'}
      </p>

      <p className="text-sm text-slate-500">
        {isEn ? 'Effective date:' : 'Fecha de vigencia:'} 2025-09-21
      </p>
    </main>
  )
}
