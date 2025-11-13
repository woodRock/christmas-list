import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ familyId: string }> }
) {
  const { familyId } = await context.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if the user is the owner of the family list
  const { data: family, error: familyError } = await supabase
    .from('lists')
    .select('user_id')
    .eq('id', familyId)
    .single()

  if (familyError) {
    console.error('Error fetching family:', familyError)
    return NextResponse.json({ error: 'Family not found' }, { status: 404 })
  }

  if (family.user_id === user.id) {
    return NextResponse.json({ error: 'Owners cannot leave their own family list. Please transfer ownership first.' }, { status: 403 })
  }

  // Delete the user's membership from the list_members table
  const { error: deleteError } = await supabase
    .from('list_members')
    .delete()
    .eq('list_id', familyId)
    .eq('profile_id', user.id)

  if (deleteError) {
    console.error('Error leaving family:', deleteError)
    return NextResponse.json({ error: 'Failed to leave family' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Successfully left family' }, { status: 200 })
}
