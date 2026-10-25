import { createClient } from '@/lib/supabase-server';
import { removeGiftPhotos } from '@/lib/giftPhotos'
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: deleted, error } = await supabase
    .from('items')
    .delete()
    .eq('user_id', user.id)
    .select('product_image_url');

  if (error) {
    console.error("Error deleting user's gifts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await removeGiftPhotos(supabase, deleted.map((item) => item.product_image_url));

  return NextResponse.json({ message: 'All your gifts have been deleted successfully' });
}
