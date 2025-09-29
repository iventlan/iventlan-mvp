'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function Quote(){
  const [busy,setBusy]=useState(false)
  const [msg,setMsg]=useState<string|null>(null)

  async function onSubmit(e:any){
    e.preventDefault()
    setBusy(true)
    const fd=new FormData(e.currentTarget)
    const payload:any=Object.fromEntries(fd.entries())
    const { error } = await supabaseBrowser.from('leads').insert(payload)
    setMsg(error? error.message : 'Enviado / Sent')
    setBusy(false)
    e.currentTarget.reset()
  }
  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">Solicitar 3 cotizaciones</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="date" type="date" className="input" required />
        <input name="colonia" className="input" placeholder="Colonia / Zona" required />
        <input name="guests" type="number" className="input" placeholder="Invitados" />
        <input name="budget_band" className="input" placeholder="Presupuesto (opcional)" />
        <textarea name="notes" className="input" placeholder="Notas (opcional)" rows={3} />
        <button className="btn btn-primary" disabled={busy}>{busy?'Enviando...':'Enviar'}</button>
      </form>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  )
}
