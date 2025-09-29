// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createSupabaseServer() {
  const cookieStore = cookies()

  return createServerClient(
    // Usa SIEMPRE las variables NEXT_PUBLIC en Next 14 para server components
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // En páginas que solo leen datos no necesitamos set/remove
        set() {},
        remove() {},
      },
    }
  )
}
