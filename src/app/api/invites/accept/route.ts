import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Joins the signed-in user to a list. accept_invite() validates the token and
// expiry; invite tokens themselves are only readable by existing members.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await request.json()

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  const { data: listId, error } = await supabase.rpc('accept_invite', { p_token: token })

  if (error) {
    const status = error.message.includes('expired') ? 410 : error.message.includes('not found') ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json({ listId })
}
