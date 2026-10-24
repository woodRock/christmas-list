import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Lets someone deal with their own wishes carried over from last season:
// "keep" clears the flag, "clear" deletes them. Only touches the caller's items.
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ familyId: string }> }
) {
  const { familyId } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await request.json()

  const query = action === 'keep'
    ? supabase.from('items').update({ carried_over: false })
    : action === 'clear'
      ? supabase.from('items').delete()
      : null

  if (!query) {
    return NextResponse.json({ error: 'Action must be "keep" or "clear"' }, { status: 400 })
  }

  const { error } = await query
    .eq('list_id', familyId)
    .eq('user_id', user.id)
    .eq('carried_over', true)
    .is('archived_at', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Done' })
}
