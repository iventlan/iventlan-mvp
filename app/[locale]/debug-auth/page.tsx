import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugAuth({ params }: { params: { locale: 'es'|'en' } }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  // Trae perfil si hay user
  let profile = null as any
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('user_id, role, display_name, phone')
      .eq('user_id', user.id)
      .maybeSingle()
    profile = data
  }

  return (
    <main className="container py-8 space-y-4">
      <h1 className="text-xl font-semibold">Debug Auth</h1>
      <pre className="p-3 rounded bg-[#f6f6f6] overflow-auto">
        {JSON.stringify({ user, profile }, null, 2)}
      </pre>

      {!user ? (
        <a className="underline" href={`/${params.locale}/login`}>Ir a login</a>
      ) : (
        <a className="underline" href={`/${params.locale}/dashboard`}>Ir al dashboard</a>
      )}
    </main>
  )
}
