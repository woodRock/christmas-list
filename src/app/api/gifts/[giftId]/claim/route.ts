import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ giftId: string }> }
) {
  const supabase = await createClient()
  const { giftId } = await context.params;
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { claimedByUserId } = await request.json()

  const { error } = await supabase
    .from('items')
    .update({ is_purchased: true, purchased_by: claimedByUserId })
    .eq('id', giftId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Gift claimed successfully' })
}
