'use client'

import * as React from 'react'
import { supabase } from '@/lib/supabase/client'

type Props = {
  providerId: number | string        // Debe coincidir con el tipo de public.providers.id
}

export default function VideoUploader({ providerId }: Props) {
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  async function fileToThumb(file: File) {
    return new Promise<{ blob: Blob; width: number; height: number; durationMs: number }>((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.src = url
      video.onloadedmetadata = async () => {
        try {
          // toma el primer frame
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Could not create thumbnail blob'))
            resolve({
              blob,
              width: video.videoWidth,
              height: video.videoHeight,
              durationMs: Math.round(video.duration * 1000),
            })
            URL.revokeObjectURL(url)
          }, 'image/jpeg', 0.8)
        } catch (e) {
          reject(e)
        }
      }
      video.onerror = () => reject(new Error('Invalid video'))
    })
  }

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'video/mp4') {
      setMsg('Solo se permite MP4 (H.264 + AAC).')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setMsg('Tamaño máximo 50MB.')
      return
    }

    setBusy(true)
    setMsg('Procesando…')

    try {
      // Generar thumbnail
      const { blob: thumbBlob, width, height, durationMs } = await fileToThumb(file)

      const id = crypto.randomUUID()
      const dir = String(providerId)                       // para la carpeta
      const videoKey = `${dir}/${id}.mp4`
      const thumbKey = `${dir}/${id}.jpg`

      // Subir video
      const { error: upV } = await supabase
        .storage
        .from('provider-videos')
        .upload(videoKey, file, { contentType: 'video/mp4', upsert: false })

      if (upV) throw upV

      // Subir thumbnail
      const { error: upT } = await supabase
        .storage
        .from('provider-video-thumbs')
        .upload(thumbKey, thumbBlob, { contentType: 'image/jpeg', upsert: false })

      if (upT) throw upT

      // Insertar fila en provider_videos (queda pending_review por las RLS)
      const { error: insErr } = await supabase.from('provider_videos').insert({
        provider_id: providerId as any, // debe coincidir con el tipo en tu DB
        path: videoKey,
        thumb_path: thumbKey,
        width,
        height,
        duration_ms: durationMs,
        caption: null,
        status: 'pending_review',
      })

      if (insErr) throw insErr

      setMsg('¡Video enviado! Quedó en revisión.')
    } catch (err: any) {
      console.error(err)
      setMsg(err.message ?? 'Error subiendo el video')
    } finally {
      setBusy(false)
      e.currentTarget.value = ''
    }
  }

  return (
    <div className="rounded-xl border border-[var(--cloud)] p-4">
      <div className="font-medium mb-2">Reels del proveedor</div>
      <input
        type="file"
        accept="video/mp4"
        disabled={busy}
        onChange={onSelect}
        className="block w-full rounded-lg border p-2"
      />
      <p className="mt-2 text-sm text-brand-slate">
        MP4, máx. 60s y 50MB. Se genera miniatura automática. Todo envío queda <b>en revisión</b>.
      </p>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  )
}
