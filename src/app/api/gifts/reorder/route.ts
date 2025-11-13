import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  console.log("PATCH /api/gifts/reorder reached!");
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("Unauthorized: No user session.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { items } = await request.json() // items is an array of { id: string, order_index: number, list_id: string }
  console.log("Request body (items for reorder):", items);

  if (!Array.isArray(items) || items.length === 0) {
    console.log("Validation error: Invalid items data.");
    return NextResponse.json({ error: 'Invalid items data' }, { status: 400 })
  }

  const listId = items[0].list_id;

  // Verify that the user is a member of the list
  const { data: member, error: memberError } = await supabase
    .from('list_members')
    .select('profile_id')
    .eq('list_id', listId)
    .eq('profile_id', user.id)
    .single()

  if (memberError || !member) {
    return NextResponse.json({ error: 'Unauthorized: You are not a member of this list.' }, { status: 403 })
  }

  const updates = items.map((item) => ({
    id: item.id,
    order_index: item.order_index,
  }))
  console.log("Updates to be sent to Supabase:", updates);

  const { error } = await supabase.rpc('reorder_items', { items_data: updates })
  console.log("Supabase rpc error:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Items reordered successfully' })
}
