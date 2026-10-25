import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Releases a gift the signed-in user claimed; unclaim_item() refuses anyone else's claim.
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ giftId: string }> }
) {
  const supabase = await createClient()
  const { giftId } = await context.params
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.rpc('unclaim_item', { p_item_id: giftId })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 409 })
  }

  return NextResponse.json({ message: 'Gift unclaimed successfully' })
}
