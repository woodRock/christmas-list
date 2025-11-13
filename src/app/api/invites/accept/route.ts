import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  // Find the invite by token
  const { data: invite, error: inviteError } = await supabase
    .from('list_invites')
    .select('id, list_id, expires_at')
    .eq('token', token)
    .single()

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Invite not found or already used.' }, { status: 404 })
  }

  // Check if the invite has expired
  if (new Date(invite.expires_at) < new Date()) {
    // Optionally, delete the expired invite
    await supabase.from('list_invites').delete().eq('id', invite.id)
    return NextResponse.json({ error: 'Invite has expired.' }, { status: 410 })
  }

  // Check if the user is already a member of the list
  const { data: existingMember, error: existingMemberError } = await supabase
    .from('list_members')
    .select('id')
    .eq('list_id', invite.list_id)
    .eq('profile_id', user.id)
    .single()

  if (existingMember) {
    // Even if they are a member, we should delete the invite and let them in
    await supabase.from('list_invites').delete().eq('id', invite.id)
    return NextResponse.json({ listId: invite.list_id })
  }

  // Add the user to the list
  const { error: insertError } = await supabase.from('list_members').insert({
    list_id: invite.list_id,
    profile_id: user.id,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Delete the invite so it can't be used again
  await supabase.from('list_invites').delete().eq('id', invite.id)

  return NextResponse.json({ listId: invite.list_id })
}
