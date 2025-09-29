// app/[locale]/login/page.tsx
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { createSupabaseServer } from '@/lib/supabase/server'

export default async function LoginPage({
  params,
}: { params: { locale: 'es' | 'en' } }) {
  const locale = params.locale
  const supabase = createSupabaseServer()

  // Si ya está logueado, mándalo al dashboard
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect(`/${locale}/dashboard`)

  return (
    <main className="container py-10">
      <div className="mx-auto w-full max-w-[480px] card p-6">
        <h1 className="text-2xl font-semibold mb-2">
          {locale === 'en' ? 'Access your account' : 'Accede a tu cuenta'}
        </h1>
        <p className="text-brand-slate mb-6">
          {locale === 'en'
            ? 'Sign in or create your account to manage your provider profile.'
            : 'Inicia sesión o crea tu cuenta para administrar tu perfil de proveedor.'}
        </p>
        <AuthForm locale={locale} />
      </div>
    </main>
  )
}
