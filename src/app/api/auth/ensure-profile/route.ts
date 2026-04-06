import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/lib/ensure-user-profile'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await ensureUserProfile(user.id)
  return NextResponse.json({ ok: true })
}
