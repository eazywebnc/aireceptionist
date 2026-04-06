import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // Verify webhook secret
  const authHeader = request.headers.get('x-webhook-secret')
  const webhookSecret = process.env.WEBHOOK_SECRET

  if (!webhookSecret || authHeader !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    user_id,
    caller_phone,
    caller_name,
    duration,
    transcript,
    summary,
    status = 'completed',
    message_text,
  } = body

  if (!user_id || !caller_phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Insert call record
  const { data: call, error: callError } = await admin
    .from('ar_calls')
    .insert({
      user_id,
      caller_number: caller_phone,
      caller_name: caller_name || null,
      duration_seconds: duration || 0,
      status,
      summary: summary || null,
    })
    .select('id')
    .single()

  if (callError) {
    return NextResponse.json({ error: callError.message }, { status: 500 })
  }

  // Insert transcript entries if provided
  if (transcript && Array.isArray(transcript) && transcript.length > 0) {
    const transcriptRows = transcript.map((entry: { speaker: string; content: string; timestamp_ms?: number }) => ({
      call_id: call.id,
      speaker: entry.speaker,
      content: entry.content,
      timestamp_ms: entry.timestamp_ms || 0,
    }))

    await admin.from('ar_transcripts').insert(transcriptRows)
  }

  // Insert message if caller left one
  if (message_text) {
    await admin.from('ar_messages').insert({
      user_id,
      call_id: call.id,
      caller_phone,
      message_text,
      handled: false,
    })
  }

  return NextResponse.json({ ok: true, call_id: call.id })
}
