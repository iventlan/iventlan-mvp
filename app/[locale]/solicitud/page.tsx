'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

const CATEGORIES = [
  { slug: 'decoracion-globos', label: 'Decoración y globos' },
  { slug: 'salones-infantiles', label: 'Salones infantiles' },
  { slug: 'mesas-de-dulces', label: 'Mesas de dulces' },
  { slug: 'foto-video',        label: 'Foto y video' },
  { slug: 'shows-animacion',   label: 'Shows y animación' },
] as const;

export default function QuotePage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState<string | null>(null);
  const router = useRouter();
  const { locale } = useParams() as { locale: string };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, any> = Object.fromEntries(fd.entries());

    if (!payload.category_slug) {
      setMsg('Elige una categoría.');
      setBusy(false);
      return;
    }

    // Insertar lead y obtener ID (usamos .select() para retornar la fila)
    const { data, error } = await supabaseBrowser
      .from('leads')
      .insert({
        category_slug: String(payload.category_slug),
        date:          payload.date ? String(payload.date) : null,
        colonia:       payload.colonia ? String(payload.colonia) : null,
        guests:        payload.guests ? Number(payload.guests) : null,
        budget_band:   payload.budget_band ? String(payload.budget_band) : null,
        notes:         payload.notes ? String(payload.notes) : null,
      })
      .select('id')      // <- devuelve el ID
      .single();

    if (error) {
      setMsg(`Error: ${error.message}`);
      setBusy(false);
      return;
    }

    // Redirige a la página de estado
    router.push(`/${locale}/solicitud/${data!.id}`);
  }

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">Solicitar 3 cotizaciones</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <select name="category_slug" className="input" required defaultValue="">
          <option value="" disabled>Elige categoría</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
        <input name="date" type="date" className="input" required />
        <input name="colonia" className="input" placeholder="Colonia / Zona" required />
        <input name="guests" type="number" className="input" placeholder="Invitados" min={1} />
        <input name="budget_band" className="input" placeholder="Presupuesto (opcional)" />
        <textarea name="notes" className="input" placeholder="Notas (opcional)" rows={3} />

        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Enviando…' : 'Enviar'}
        </button>
      </form>

      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
