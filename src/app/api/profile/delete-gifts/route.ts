import { createClient } from '@/lib/supabase-server';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error("Error deleting user's gifts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'All your gifts have been deleted successfully' });
}
