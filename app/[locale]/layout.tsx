// app/[locale]/layout.tsx  (Server Component)
import Link from 'next/link'
import Image from 'next/image'
import I18nProvider from '@/components/I18nProvider'
import SignOutButton from '@/components/SignOutButton'
import CookieBanner from '@/components/CookieBanner'
import { createSupabaseServer } from '@/lib/supabase/server'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: 'es' | 'en' }
}) {
  const locale = params.locale
  const other = locale === 'en' ? 'es' : 'en'

  // Leemos al usuario en el servidor
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <I18nProvider locale={locale}>
      <header className="sticky top-0 z-40 border-b border-[var(--cloud)] bg-white/70 backdrop-blur">
        <div className="container h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            aria-label="Iventlan — inicio"
            className="inline-flex items-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <Image
              src="/logo.png"
              alt="Iventlan"
              width={56}
              height={56}
              priority
              className="block h-10 w-10 md:h-12 md:w-12"
            />
          </Link>

          {/* Nav principal (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href={`/${locale}/proveedores`}
              className="text-slate hover:text-[var(--ink)] transition"
            >
              {locale === 'en' ? 'Providers' : 'Proveedores'}
            </Link>

            {/* Ruta de registro de proveedor (ajústala si tu alta está en otro path) */}
            <Link
              href={`/${locale}/provider`}
              className="text-slate hover:text-[var(--ink)] transition"
            >
              {locale === 'en' ? 'Provider signup' : 'Registro proveedor'}
            </Link>

            {/* Auth */}
            {!user ? (
              <Link
                href={`/${locale}/login`}
                className="text-slate hover:text-[var(--ink)] transition"
              >
                {locale === 'en' ? 'Sign in' : 'Entrar'}
              </Link>
            ) : (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-slate hover:text-[var(--ink)] transition"
                >
                  Dashboard
                </Link>
                {/* Client component */}
                <SignOutButton label={locale === 'en' ? 'Sign out' : 'Cerrar sesión'} />
              </>
            )}

            {/* Switch de idioma */}
            <Link
              href={`/${other}`}
              className="btn btn--sm btn--pill btn-ghost"
              aria-label={locale === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            >
              {other.toUpperCase()}
            </Link>
          </nav>

          {/* Acciones (mobile): solo el switch de idioma + acceso */}
          <div className="md:hidden flex items-center gap-3">
            {!user ? (
              <Link
                href={`/${locale}/login`}
                className="text-sm underline"
              >
                {locale === 'en' ? 'Sign in' : 'Entrar'}
              </Link>
            ) : (
              <Link
                href={`/${locale}/dashboard`}
                className="text-sm underline"
              >
                Dashboard
              </Link>
            )}
            <Link
              href={`/${other}`}
              className="btn btn--sm btn--pill btn-ghost"
              aria-label={locale === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            >
              {other.toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      {children}

            <footer className="border-t border-[var(--cloud)] mt-12">
        <div className="container py-8 text-sm text-slate flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} Iventlan
          </span>

          <nav className="flex gap-4">
            <Link
              href={`/${params.locale}/legal/privacidad`}
              className="underline"
            >
              {params.locale === 'en' ? 'Privacy Notice' : 'Aviso de privacidad'}
            </Link>

            <Link
              href={`/${params.locale}/legal/terminos`}
              className="underline"
            >
              {params.locale === 'en' ? 'Terms & Conditions' : 'Términos y condiciones'}
            </Link>
          </nav>
        </div>
      </footer>


      {/* Banner de cookies (client component, fijo abajo) */}
      <CookieBanner locale={locale} />
    </I18nProvider>
  )
}
