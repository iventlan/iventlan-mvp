// components/ReelsCarousel.tsx
import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServer } from '@/lib/supabase/server'
import PlayButton from '@/components/PlayButton' 


export default async function ReelsCarousel() {
  const supabase = createSupabaseServer()
  const { data } = await supabase
    .from('vw_featured_reels')
    .select('id, path, thumb_path, provider_slug, brand_name')
    .limit(12)

  if (!data?.length) return null

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reels sugeridos</h2>
        <Link href="/es/proveedores" className="text-sm underline">Ver todos</Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {data.map(v => (
          <ReelCard key={v.id} path={v.path!} thumbPath={v.thumb_path!} brand={v.brand_name!} />
        ))}
      </div>
    </div>
  )
}

function ReelCard({ path, thumbPath, brand }: { path: string; thumbPath: string; brand: string }) {
  return (
    <div className="rounded-xl overflow-hidden bg-white border">
      <VideoThumb path={path} thumbPath={thumbPath} />
      <div className="p-2 text-sm">{brand}</div>
    </div>
  )
}

// Cliente: pide URL firmada y reproduce
// (separamos para no bloquear el server component)
function VideoThumb({ path, thumbPath }: { path: string; thumbPath: string }) {
  return (
    <div className="relative aspect-[9/16] bg-[var(--cloud)]">
      {/* miniatura pública */}
      {/* Si usas Next <Image/> con dominios propios de Supabase, ajusta next.config */}
      <img
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/provider-video-thumbs/${thumbPath}`}
        alt="thumb"
        className="h-full w-full object-cover"
      />
      <PlayButton path={path} />
    </div>
  )
}
