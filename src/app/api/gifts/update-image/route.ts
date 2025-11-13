// src/app/api/gifts/update-image/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function PATCH(request: Request) {
  const { giftId, imageUrl } = await request.json();
  const supabase = await createClient();

  // Basic validation
  if (!giftId || !imageUrl) {
    return NextResponse.json({ error: 'giftId and imageUrl are required' }, { status: 400 });
  }

  try {
    // Fetch the gift to check ownership/permissions
    const { data: gift, error: fetchError } = await supabase
      .from('items')
      .select('list_id, user_id')
      .eq('id', giftId)
      .single();

    if (fetchError || !gift) {
      console.error('Error fetching gift:', fetchError);
      return NextResponse.json({ error: 'Gift not found or unauthorized' }, { status: 404 });
    }

    // Check if the current user is the owner of the list
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('id', gift.list_id)
      .single();

    if (listError || !list || list.user_id !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to update this gift' }, { status: 403 });
    }

    // Update the product_image_url
    const { data, error } = await supabase
      .from('items')
      .update({ product_image_url: imageUrl })
      .eq('id', giftId);

    if (error) {
      console.error('Error updating product image URL:', error);
      return NextResponse.json({ error: 'Failed to update product image URL' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product image URL updated successfully' });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
