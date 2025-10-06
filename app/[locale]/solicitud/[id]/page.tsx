import { supabaseBrowser } from '@/lib/supabase/client';

type Lead = {
  id: number;
  status: string | null;
  category_slug: string | null;
  selected_provider_slugs: string[] | null;
  created_at: string;
  colonia: string | null;
  date: string | null;
  budget_band: string | null;
};

async function getLead(id: string) {
  const { data, error } = await supabaseBrowser
    .from('leads')
    .select('id,status,category_slug,selected_provider_slugs,created_at,colonia,date,budget_band')
    .eq('id', Number(id))
    .single<Lead>();
  if (error) throw error;
  return data!;
}

// Mapa rápido de etiquetas para mostrar categoría
const CATEGORY_LABEL: Record<string, string> = {
  'decoracion-globos': 'Decoración y globos',
  'salones-infantiles': 'Salones infantiles',
  'mesas-de-dulces': 'Mesas de dulces',
  'foto-video': 'Foto y video',
  'shows-animacion': 'Shows y animación',
};

export default async function LeadStatus({ params }: { params: { id: string, locale: string } }) {
  const lead = await getLead(params.id);

  const count = lead.selected_provider_slugs?.length ?? 0;
  const label = lead.category_slug ? CATEGORY_LABEL[lead.category_slug] ?? lead.category_slug : '—';

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">Estado de tu solicitud</h1>

      <div className="rounded-xl border p-4 bg-white">
        <div className="text-sm text-zinc-600">ID #{lead.id}</div>
        <div className="mt-1 text-lg">
          Categoría: <b>{label}</b>
        </div>
        <div className="mt-1">Zona: {lead.colonia ?? '—'}</div>
        <div className="mt-1">Fecha: {lead.date ?? '—'}</div>
        <div className="mt-1">Presupuesto: {lead.budget_band ?? '—'}</div>

        <div className="mt-4">
          <div className="text-sm text-zinc-600">Progreso</div>
          <div className="mt-1">
            <b>{lead.status ?? 'new'}</b> — enviado a {count} proveedor{count === 1 ? '' : 'es'}.
          </div>
          {count > 0 && (
            <ul className="mt-2 list-disc ml-5 text-sm">
              {lead.selected_provider_slugs!.map((s) => <li key={s}>{s}</li>)}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-600">
        Te contactarán directamente por WhatsApp o correo. Si no recibes respuesta en 24 h,
        vuelve a solicitar o escríbenos.
      </p>
    </div>
  );
}
