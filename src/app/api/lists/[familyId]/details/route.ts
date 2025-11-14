import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
  order_index?: number;
  notes?: string;
  price?: number;
  product_url?: string;
  product_title?: string;
  product_image_url?: string;
  product_price?: number;
}

interface Member {
  id: string;
  name: string;
  gifts: Gift[];
}

interface Family {
  id: string;
  name: string;
  owner_id: string;
  members: Member[];
}

interface ProfileInListMember {
  full_name: string;
}

export async function GET(
  request: NextRequest,
  context: any // Temporarily cast to any to bypass stubborn type error
) {
  const { familyId } = await context.params; // Destructure params from context
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id, list_members(profile_id, profiles(full_name))')
    .eq('id', familyId) // Use familyId directly
    .single()

  if (listError) {
    console.error("Error loading family list:", listError);
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  if (!listData) {
    return NextResponse.json({ error: 'Family list not found.' }, { status: 404 })
  }

  // Define the type for list_members here for local use
  type ListMemberType = {
    profile_id: string;
    profiles: ProfileInListMember[];
  };

  const isOwner = listData.user_id === user.id;
  const isMember = (listData.list_members as ListMemberType[]).some((member: ListMemberType) => member.profile_id === user.id);

  if (!isOwner && !isMember) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('items')
    .select('id, name, is_purchased, purchased_by, user_id, order_index, notes, price, product_url, product_title, product_image_url, product_price')
    .eq('list_id', familyId)
    .order('order_index')

  if (itemsError) {
    console.error("Error loading gifts:", itemsError);
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  const profileIds = new Set<string>();
  itemsData.forEach(item => {
    profileIds.add(item.user_id);
    if (item.purchased_by) {
      profileIds.add(item.purchased_by);
    }
  });
  profileIds.add(listData.user_id);

  (listData.list_members as ListMemberType[]).forEach((lm: ListMemberType) => {
    profileIds.add(lm.profile_id);
  });

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', Array.from(profileIds));

  if (profilesError) {
    console.error("Error loading profiles:", profilesError);
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  const membersMap = new Map<string, Member>();
  profilesData.forEach(profile => {
    membersMap.set(profile.id, {
      id: profile.id,
      name: profile.full_name,
      gifts: [],
    });
  });

  itemsData.forEach(item => {
    const recipientMember = membersMap.get(item.user_id);
    if (recipientMember) {
      recipientMember.gifts.push({
        id: item.id,
        description: item.name,
        is_purchased: item.is_purchased,
        purchased_by: item.purchased_by || undefined,
        user_id: item.user_id,
        order_index: item.order_index || 0,
        notes: item.notes || undefined,
        price: item.price || undefined,
        product_url: item.product_url || undefined,
        product_title: item.product_title || undefined,
        product_image_url: item.product_image_url || undefined,
        product_price: item.product_price || undefined,
      });
    }
  });

  const family: Family = {
    id: listData.id,
    name: listData.name,
    owner_id: listData.user_id,
    members: Array.from(membersMap.values()),
  };

  return NextResponse.json(family)
}