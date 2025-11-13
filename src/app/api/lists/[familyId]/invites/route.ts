import { createClient } from '@/lib/supabase-server'
import { NextResponse, NextRequest } from 'next/server' // Import NextRequest
import { randomBytes } from 'crypto'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ familyId: string }> } // Change to Promise
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error('Invite generation failed: User not authenticated.')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await context.params; // Await the params
  const listId = resolvedParams.familyId; // Access familyId from resolved params

  // Verify that the user is a member of the list
  const { data: member, error: memberError } = await supabase
    .from('list_members')
    .select('profile_id')
    .eq('list_id', listId)
    .eq('profile_id', user.id)
    .single()

  if (memberError) {
    console.error('Invite generation failed: Error checking list membership.', memberError)
    return NextResponse.json({ error: 'Error checking list membership.' }, { status: 500 })
  }

  if (!member) {
    console.error('Invite generation failed: User is not a member of this list.')
    return NextResponse.json(
      { error: 'Unauthorized: You are not a member of this list.' },
      { status: 403 }
    )
  }

  // Generate a unique token
  const token = randomBytes(32).toString('hex')

  // Set an expiration date (e.g., 24 hours from now)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  // Store the invite token in the database
  const { error: insertError } = await supabase.from('list_invites').insert({
    list_id: listId,
    token: token,
    expires_at: expiresAt.toISOString(),
  })

  if (insertError) {
    console.error('Invite generation failed: Could not insert invite token into database.', insertError)
    return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 })
  }

  return NextResponse.json({ token })
}

