// app/[locale]/dashboard/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'


export default async function DashboardPage({
  params,
}: { params: { locale: 'es' | 'en' } }) {
  const locale = params.locale
  const isEn = locale === 'en'

  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // rol en profiles (default: provider)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  const role = (profile?.role ?? 'provider') as 'provider' | 'admin'

  // ¿ya tiene ficha de proveedor?
  const { data: myProvider } = await supabase
    .from('providers')
    .select('id, slug, brand_name, verification_status')
    .eq('owner_id', user.id)
    .maybeSingle()

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-2">
        {isEn ? 'Dashboard' : 'Panel'}
      </h1>
      <p className="text-brand-slate mb-6">
        {isEn
          ? 'Welcome! From here you can manage your provider presence on Iventlan.'
          : '¡Bienvenido(a)! Desde aquí puedes gestionar tu presencia como proveedor en Iventlan.'}
      </p>

      {/* Bloque principal según tenga/no tenga ficha */}
      {myProvider ? (
        <section className="rounded-xl border bg-white p-5 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">
              {myProvider.brand_name ?? (isEn ? 'Your provider card' : 'Tu ficha de proveedor')}
            </h2>
            {myProvider.verification_status && (
              <span className="rounded-full bg-[var(--brand-accent-100)] px-2.5 py-0.5 text-xs">
                {isEn ? 'Status' : 'Estado'}: {myProvider.verification_status}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {myProvider.slug && (
              <Link
                href={`/${locale}/proveedores/${myProvider.slug}`}
                className="btn btn--sm btn-ghost"
              >
                {isEn ? 'View public profile' : 'Ver perfil público'}
              </Link>
            )}
            <Link
              href={`/${locale}/provider`}
              className="btn btn--sm"
            >
              {isEn ? 'Edit provider card' : 'Editar ficha de proveedor'}
            </Link>
            <Link
              href={`/${locale}/dashboard/videos`}
              className="btn btn--sm btn-ghost"
            >
              {isEn ? 'Manage videos' : 'Gestionar videos'}
            </Link>
          </div>

          <p className="mt-4 text-sm text-brand-slate">
            {isEn
              ? 'Tip: Complete your photos and short bio to increase conversions.'
              : 'Tip: Completa tus fotos y la bio corta para incrementar tus conversiones.'}
          </p>
        </section>
      ) : (
        <section className="rounded-xl border bg-white p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">
            {isEn ? 'Create your provider card' : 'Crea tu ficha de proveedor'}
          </h2>
          <p className="text-brand-slate mb-4">
            {isEn
              ? 'Add your business info, contact and images. We will review and publish it.'
              : 'Agrega la información de tu negocio, contacto e imágenes. La revisaremos y la publicaremos.'}
          </p>
          <Link
            href={`/${locale}/provider`}
            className="inline-flex h-11 items-center rounded-full bg-[var(--brand-primary)] px-6 font-semibold text-white hover:opacity-95"
          >
            {isEn ? 'Start now' : 'Comenzar ahora'}
          </Link>
        </section>
      )}

      {/* Extra links */}
      <div className="flex flex-wrap gap-4">
        {role === 'admin' && (
          <Link href={`/${locale}/dashboard/admin`} className="text-sm underline">
            {isEn ? 'Admin (review reels)' : 'Admin (revisar reels)'}
          </Link>
        )}
        <Link href={`/${locale}/provider`} className="text-sm underline">
          {isEn ? 'Provider signup' : 'Registro proveedor'}
        </Link>
      </div>
    </main>
  )
}
