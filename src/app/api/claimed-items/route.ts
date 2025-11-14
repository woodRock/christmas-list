import { createClient } from '@/lib/supabase-server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: claimedItems, error } = await supabase
    .from('items')
    .select('id, name, notes, price, product_url, product_title, product_image_url')
    .eq('purchased_by', user.id)
    .order('name', { ascending: true }); // Order by name for a consistent list

  if (error) {
    console.error("Error fetching claimed items:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(claimedItems);
}
