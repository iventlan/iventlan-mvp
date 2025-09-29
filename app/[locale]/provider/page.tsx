// app/[locale]/provider/page.tsx
import { redirect } from 'next/navigation'

export default function ProviderRedirect({
  params,
}: { params: { locale: 'es' | 'en' } }) {
  // Cambia el destino si tu ruta es distinta
  redirect(`/${params.locale}/proveedores/registrar`)
}
