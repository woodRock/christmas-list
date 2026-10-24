import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Starts a new season on a list: claimed gifts move to history, unclaimed
// wishes are carried over. Owner-only, enforced inside start_new_season.
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

  const { name, renameList } = await request.json()

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Season name is required' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('start_new_season', {
    p_list_id: familyId,
    p_season_name: name.trim(),
    p_rename_list: Boolean(renameList),
  })

  if (error) {
    const status = error.message.includes('Only the list owner') ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json(data)
}
