import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { giftId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { description } = await request.json()

  if (!description) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('items')
    .update({ name: description })
    .eq('id', params.giftId)
    .eq('user_id', user.id) // Ensure only the owner can edit their gift

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Gift updated successfully' })
}

export async function DELETE(
  request: Request,
  { params }: { params: { giftId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', params.giftId)
    .eq('user_id', user.id) // Ensure only the owner can delete their gift

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Gift deleted successfully' })
}
