import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FamilyListClient from './FamilyListClient'
import ErrorState from '@/components/ui/ErrorState'
import type { Family, Member } from './types'

interface ProfileInListMember {
  full_name: string;
}

interface ListMember {
  profile_id: string;
  profiles: ProfileInListMember[];
}

export default async function FamilyListPage({ params }: { params: { familyId: string } }) {
  const resolvedParams = await Promise.resolve(params); // Ensure params are resolved
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id, season_name, season_started_at, list_members(profile_id, profiles(full_name))')
    .eq('id', resolvedParams.familyId)
    .single()
  console.log("listData:", listData);

  if (listError) {
    return <ErrorState title="We couldn’t open this list" message={listError.message} />
  }

  if (!listData) {
    return <ErrorState title="List not found" message="It may have been deleted, or you might not have access." />
  }

  const isOwner = listData.user_id === user.id;
  const isMember = listData.list_members.some((member: ListMember) => member.profile_id === user.id);

  if (!isOwner && !isMember) {
    redirect('/')
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('items')
    .select('id, name, is_purchased, purchased_by, user_id, order_index, notes, price, product_url, product_title, product_image_url, product_price, carried_over')
    .eq('list_id', resolvedParams.familyId)
    .is('archived_at', null)
    .order('order_index')

  if (itemsError) {
    return <ErrorState title="We couldn’t load the gifts" message={itemsError.message} />
  }

  const profileIds = new Set<string>();
  itemsData.forEach(item => {
    profileIds.add(item.user_id); // Recipient
    if (item.purchased_by) {
      profileIds.add(item.purchased_by); // Purchaser
    }
  });
  profileIds.add(listData.user_id); // List owner

  // Extract profiles from list_members
  listData.list_members.forEach((lm: ListMember) => {
    profileIds.add(lm.profile_id);
  });
  console.log("profileIds after collecting from items, owner, and list_members:", profileIds);

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', Array.from(profileIds));
  console.log("profilesData after fetching:", profilesData);

  if (profilesError) {
    return <ErrorState title="We couldn’t load this list’s members" message={profilesError.message} />
  }

  const membersMap = new Map<string, Member>();
  profilesData.forEach(profile => {
    membersMap.set(profile.id, {
      id: profile.id,
      name: profile.full_name,
      gifts: [],
    });
  });
  console.log("membersMap after populating:", membersMap);

  itemsData.forEach(item => {
    const recipientMember = membersMap.get(item.user_id);
    if (recipientMember) {
      recipientMember.gifts.push({
        id: item.id,
        description: item.name,
        is_purchased: item.is_purchased,
        purchased_by: item.purchased_by || undefined,
        user_id: item.user_id,
        order_index: item.order_index || 0, // Assign order_index
        notes: item.notes || undefined,
        price: item.price || undefined,
        product_url: item.product_url || undefined,
        product_title: item.product_title || undefined,
        product_image_url: item.product_image_url || undefined,
        product_price: item.product_price || undefined,
        carried_over: item.carried_over || undefined,
      });
    }
  });

  const family: Family = {
    id: listData.id,
    name: listData.name,
    owner_id: listData.user_id,
    season_name: listData.season_name ?? undefined,
    season_started_at: listData.season_started_at ?? undefined,
    members: Array.from(membersMap.values()),
  };

  console.log("Current User ID:", user.id);
  console.log("Family Members:", family.members);

  return (
    <FamilyListClient initialFamily={family} initialUser={user} familyId={resolvedParams.familyId} />
  )
}
