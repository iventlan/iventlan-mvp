'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SignOutButton({ label = 'Cerrar sesión' }: { label?: string }) {
  const router = useRouter()
  async function signOut() {
    await supabase.auth.signOut()
    router.refresh()
  }
  return (
    <button onClick={signOut} className="text-sm underline">
      {label}
    </button>
  )
}
