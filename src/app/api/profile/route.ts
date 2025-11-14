import { createClient } from '@/lib/supabase-server';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { full_name } = await request.json();

  if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
    return NextResponse.json({ error: 'Invalid full name provided' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: full_name.trim() })
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile name:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Profile name updated successfully' });
}
