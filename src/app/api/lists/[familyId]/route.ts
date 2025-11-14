import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  context: any // Temporarily cast to any to bypass stubborn type error
) {
  const { params } = context; // Destructure params from context
  const { familyId } = params; // Destructure familyId from params
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id')
    .eq('id', familyId)
    .single();

  if (listError) {
    console.error("Error fetching list:", listError);
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  if (!listData) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 });
  }

  // Check if the user is the owner or a member (for basic GET access)
  const { data: listMembers, error: membersError } = await supabase
    .from('list_members')
    .select('profile_id')
    .eq('list_id', familyId)
    .eq('profile_id', user.id);

  const isOwner = listData.user_id === user.id;
  const isMember = listMembers && listMembers.length > 0;

  if (!isOwner && !isMember) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(listData);
}

export async function PATCH(
  request: NextRequest,
  context: any // Temporarily cast to any to bypass stubborn type error
) {
  const { params } = context; // Destructure params from context
  const { familyId } = params; // Destructure familyId from params
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Invalid list name provided' }, { status: 400 });
  }

  // Check if user is the owner of the list
  const { data: listData, error: fetchError } = await supabase
    .from('lists')
    .select('user_id')
    .eq('id', familyId)
    .single();

  if (fetchError || !listData) {
    return NextResponse.json({ error: 'List not found or access denied' }, { status: 404 });
  }

  if (listData.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden: Only the list owner can update the list name' }, { status: 403 });
  }

  const { error } = await supabase
    .from('lists')
    .update({ name: name.trim() })
    .eq('id', familyId);

  if (error) {
    console.error("Error updating list name:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'List name updated successfully' });
}

export async function DELETE(
  request: NextRequest,
  context: any // Temporarily cast to any to bypass stubborn type error
) {
  const { familyId } = await context.params; // Destructure familyId from params
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is the owner of the list
  const { data: listData, error: fetchError } = await supabase
    .from('lists')
    .select('user_id')
    .eq('id', familyId)
    .single();

  if (fetchError || !listData) {
    return NextResponse.json({ error: 'List not found or access denied' }, { status: 404 });
  }

  if (listData.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden: Only the list owner can delete the list' }, { status: 403 });
  }

  // Delete the list (Supabase RLS should handle cascading deletes for items and list_members)
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', familyId);

  if (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'List deleted successfully' });
}
