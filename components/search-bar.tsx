'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Cat = { slug:string; name:string }

export default function SearchBar({ locale, cats }:{ locale:string; cats:Cat[] }) {
  const r = useRouter()
  const [q,setQ] = useState('')
  const [cat,setCat] = useState('')
  const [city,setCity] = useState('')

  function submit(e?:React.FormEvent){
    e?.preventDefault()
    const params = new URLSearchParams()
    if(q) params.set('q', q)
    if(cat) params.set('cat', cat)
    if(city) params.set('city', city)
    r.push(`/${locale}/proveedores?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_200px_180px]">
      <div className="relative">
        <input
          className="input rounded-full"
          placeholder={locale==='en' ? 'What do you need?' : '¿Qué necesitas para tu evento?'}
          value={q} onChange={(e)=>setQ(e.target.value)}
        />
      </div>

      <select className="select rounded-full" value={cat} onChange={(e)=>setCat(e.target.value)}>
        <option value="">{locale==='en' ? 'Category' : 'Categoría'}</option>
        {cats.map(c=> <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>

      <div className="flex gap-2">
        <input
          className="input flex-1 rounded-full"
          placeholder={locale==='en' ? 'City' : 'Ciudad'}
          value={city} onChange={(e)=>setCity(e.target.value)}
        />
        <button type="submit" className="btn-cta">{locale==='en'?'Search':'Buscar'}</button>
      </div>
    </form>
  )
}
