import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/lib/ensure-user-profile'

export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure shared_users profile exists
  const admin = (await import('@/lib/supabase/server')).createAdminClient()
  const { data: existingUser } = await admin
    .from('shared_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    await admin.from('shared_users').upsert(
      {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      },
      { onConflict: 'id' }
    )
  }

  // Ensure ar_settings exists
  await ensureUserProfile(user.id)

  return NextResponse.json({ ok: true })
}
