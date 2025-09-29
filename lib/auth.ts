// lib/auth.ts
import { createSupabaseServer } from '@/lib/supabase/server'

export async function getUserAndRole() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, role: null }

  // lee el rol en profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name, phone')
    .eq('user_id', user.id)
    .maybeSingle()

  return { user, role: profile?.role ?? 'provider', profile }
}
