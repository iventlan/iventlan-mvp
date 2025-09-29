'use client'

import * as React from 'react'

export default function PlayButton({ path }: { path: string }) {
  const [url, setUrl] = React.useState<string | null>(null)

  async function open() {
    const res = await fetch(`/api/video-url?path=${encodeURIComponent(path)}`)
    const json = await res.json()
    if (json.url) setUrl(json.url)
  }

  function close() {
    setUrl(null)
  }

  return (
    <>
      <button
        onClick={open}
        className="absolute inset-0 grid place-items-center text-white/90"
        aria-label="Reproducir"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur">
          ▶
        </span>
      </button>

      {url && (
        <div className="fixed inset-0 z-[60] bg-black/70 p-4" onClick={close}>
          <div className="mx-auto max-w-[420px]">
            <video
              src={url}
              controls
              playsInline
              autoPlay
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
