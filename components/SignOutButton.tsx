'use client'

import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client';


export default function SignOutButton({ label = 'Cerrar sesión' }: { label?: string }) {
  const router = useRouter()
  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.refresh()
  }
  return (
    <button onClick={signOut} className="text-sm underline">
      {label}
    </button>
  )
}
