// app/api/video-url/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') // ej: "123/uuid.mp4"
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // CLAVE DE SERVIDOR
  )

  const { data, error } = await supabase
    .storage
    .from('provider-videos')
    .createSignedUrl(path, 60 * 2) // 2 minutos

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ url: data.signedUrl })
}
