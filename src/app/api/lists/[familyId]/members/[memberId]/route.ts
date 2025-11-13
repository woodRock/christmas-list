import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  context: { params: { familyId: string; memberId: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { familyId, memberId } = await context.params

  // Verify that the current user is the owner of the list
  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('user_id')
    .eq('id', familyId)
    .single()

  if (listError || !list) {
    return NextResponse.json({ error: `List not found for familyId: ${familyId}` }, { status: 404 })
  }

  if (list.user_id !== user.id) {
    return NextResponse.json({ error: 'Only the list owner can remove members' }, { status: 403 })
  }

  // Delete the member from the list_members table
  const { error: removeMemberError } = await supabase
    .from('list_members')
    .delete()
    .eq('list_id', familyId)
    .eq('profile_id', memberId)

  if (removeMemberError) {
    return NextResponse.json({ error: removeMemberError.message }, { status: 500 })
  }

  // Delete all items from the items table that belong to the removed member and the current list
  const { error: deleteItemsError } = await supabase
    .from('items')
    .delete()
    .eq('list_id', familyId)
    .eq('user_id', memberId)

  if (deleteItemsError) {
    return NextResponse.json({ error: deleteItemsError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Member removed successfully' })
}
