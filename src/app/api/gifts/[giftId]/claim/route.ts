import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Claims a gift for the signed-in user. claim_item() checks list membership,
// that it isn't your own gift, and that nobody claimed it first.
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

  const { error } = await supabase.rpc('claim_item', { p_item_id: giftId })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 409 })
  }

  return NextResponse.json({ message: 'Gift claimed successfully' })
}
