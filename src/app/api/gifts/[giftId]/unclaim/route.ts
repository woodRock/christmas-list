import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { giftId: string } }
) {
  const supabase = await createClient()
  const resolvedParams = await params;
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('items')
    .update({ is_purchased: false, purchased_by: null })
    .eq('id', resolvedParams.giftId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Gift unclaimed successfully' })
}
