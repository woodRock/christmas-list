import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  console.log("PATCH /api/gifts/reorder reached!");
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("Unauthorized: No user session.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { items } = await request.json() // items is an array of { id: string, order_index: number }
  console.log("Request body (items for reorder):", items);

  if (!Array.isArray(items) || items.length === 0) {
    console.log("Validation error: Invalid items data.");
    return NextResponse.json({ error: 'Invalid items data' }, { status: 400 })
  }

  const updates = items.map((item) => ({
    id: item.id,
    order_index: item.order_index,
  }))
  console.log("Updates to be sent to Supabase:", updates);

  const { error } = await supabase
    .from('items')
    .upsert(updates, { onConflict: 'id' }) // Upsert to update existing items
  console.log("Supabase upsert error:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Items reordered successfully' })
}
