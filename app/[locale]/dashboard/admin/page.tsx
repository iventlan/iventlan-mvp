// app/[locale]/dashboard/admin/page.tsx
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import AdminProvidersClient from './providers-client'
export const dynamic = 'force-dynamic'


export default async function AdminProvidersPage({
  params,
}: { params: { locale: 'es' | 'en' } }) {
  const locale = params.locale
  const supabase = createSupabaseServer()

  // 1) Sesión
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // 2) Rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect(`/${locale}/dashboard`)
  }

  return <AdminProvidersClient locale={locale} />
}
