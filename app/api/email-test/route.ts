// app/api/email-test/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM!
const TO =
  process.env.ADMIN_EMAIL ||
  process.env.RESEND_REPLY_TO ||
  'iventlanmx@gmail.com'

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,                // p.ej. "Iventlan <notificaciones@mail.iventlan.com>"
      to: [TO],                  // te lo mandas a ti para probar
      subject: 'Iventlan: prueba de correo',
      text: '¡Funciona! ✅ Este es un correo de prueba desde /api/email-test.',
      replyTo: process.env.RESEND_REPLY_TO || undefined,
    })

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 500 })
    }
    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
