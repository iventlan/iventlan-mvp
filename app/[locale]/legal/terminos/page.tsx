// /app/[locale]/legal/terminos/page.tsx
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: { params: { locale: 'es' | 'en' } }): Promise<Metadata> {
  const isEn = params.locale === 'en'
  return {
    title: isEn ? 'Terms & Conditions — Iventlan' : 'Términos y Condiciones — Iventlan',
    description: isEn
      ? 'Rules for using Iventlan as a client or provider.'
      : 'Reglas para usar Iventlan como cliente o proveedor.',
  }
}

export default function TermsPage({ params }: { params: { locale: 'es' | 'en' } }) {
  const isEn = params.locale === 'en'
  return (
    <main className="container py-10 prose prose-slate max-w-3xl">
      <h1>{isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}</h1>
      <p className="lead">
        {isEn
          ? 'By using Iventlan you agree to these terms.'
          : 'Al usar Iventlan aceptas estos términos.'}
      </p>

      <h2>{isEn ? 'Accounts and providers' : 'Cuentas y proveedores'}</h2>
      <ul>
        <li>{isEn ? 'You must provide accurate information.' : 'Debes proporcionar información veraz.'}</li>
        <li>{isEn ? 'Providers are responsible for their services, media and prices.'
                  : 'Los proveedores son responsables de sus servicios, medios y precios.'}</li>
        <li>{isEn ? 'Profiles may be reviewed and unpublished if policies are violated.'
                  : 'Los perfiles pueden ser revisados y despublicados si violan políticas.'}</li>
      </ul>

      <h2>{isEn ? 'Quotes and payments' : 'Cotizaciones y pagos'}</h2>
      <p>
        {isEn
          ? 'Quotes are handled between client and provider. If we enable paid promotions or fees, terms will be displayed at checkout.'
          : 'Las cotizaciones se gestionan entre cliente y proveedor. Si habilitamos promociones de pago o comisiones, los términos se mostrarán en el checkout.'}
      </p>

      <h2>{isEn ? 'Prohibited content' : 'Contenido prohibido'}</h2>
      <p>
        {isEn
          ? 'No illegal, misleading or harmful content. We may remove content at our discretion.'
          : 'No se permite contenido ilegal, engañoso o dañino. Podemos remover contenido a nuestra discreción.'}
      </p>

      <h2>{isEn ? 'Liability' : 'Responsabilidad'}</h2>
      <p>
        {isEn
          ? 'Iventlan is a marketplace; providers are solely responsible for their services.'
          : 'Iventlan es un marketplace; los proveedores son los únicos responsables de sus servicios.'}
      </p>

      <h2>{isEn ? 'Changes' : 'Cambios'}</h2>
      <p>
        {isEn
          ? 'We may update these terms. The new effective date will be posted.'
          : 'Podemos actualizar estos términos. Se publicará la nueva fecha de vigencia.'}
      </p>

      <p className="text-sm text-slate-500">
        {isEn ? 'Effective date:' : 'Fecha de vigencia:'} 2025-09-21
      </p>
    </main>
  )
}
