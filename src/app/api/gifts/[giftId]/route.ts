import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ giftId: string }> }
) {
  console.log("PATCH /api/gifts/[giftId] reached!");
  const supabase = await createClient()
  const { giftId } = await context.params;
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("Unauthorized: No user session.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { description, notes, price, product_url, product_title, product_image_url, product_price } = await request.json()

  if (!description) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 })
  }

  const updatePayload: Record<string, string | number | null> = { name: description };
  if (notes !== undefined) updatePayload.notes = notes;
  if (price !== undefined) updatePayload.price = price;
  if (product_url !== undefined) updatePayload.product_url = product_url;
  if (product_title !== undefined) updatePayload.product_title = product_title;
  if (product_image_url !== undefined) updatePayload.product_image_url = product_image_url;
  if (product_price !== undefined) updatePayload.product_price = product_price;

  const { error } = await supabase
    .from('items')
    .update(updatePayload)
    .eq('id', giftId)
    .eq('user_id', user.id) // Ensure only the owner can edit their gift

  console.log("Supabase update error:", error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Gift updated successfully' })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ giftId: string }> }
) {
  console.log("DELETE /api/gifts/[giftId] reached!");
  const supabase = await createClient()
  const { giftId } = await context.params;
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("Unauthorized: No user session.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', giftId)
    .eq('user_id', user.id) // Ensure only the owner can delete their gift
  console.log("Supabase delete error:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Gift deleted successfully' })
}
