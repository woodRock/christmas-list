import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FamilyListClient from './FamilyListClient' // Client component for the list

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
  order_index?: number; // Add order_index
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

export default async function FamilyListPage({ params }: { params: { familyId: string } }) {
  const supabase = await createClient()
  const resolvedParams = await params
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id, list_members(profile_id, profiles(full_name))')
    .eq('id', resolvedParams.familyId)
    .single()
  console.log("listData:", listData);

  if (listError) {
    return <p className="text-red-500 text-center">Error loading family list: {listError.message}</p>
  }

  if (!listData) {
    return <p className="text-center text-gray-600">Family list not found.</p>
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('items')
    .select('id, name, is_purchased, purchased_by, user_id, order_index') // Select order_index
    .eq('list_id', resolvedParams.familyId)

  if (itemsError) {
    return <p className="text-red-500 text-center">Error loading gifts: {itemsError.message}</p>
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
  listData.list_members.forEach((lm: any) => {
    profileIds.add(lm.profile_id);
  });
  console.log("profileIds after collecting from items, owner, and list_members:", profileIds);

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', Array.from(profileIds));
  console.log("profilesData after fetching:", profilesData);

  if (profilesError) {
    return <p className="text-red-500 text-center">Error loading profiles: {profilesError.message}</p>
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
      });
    }
  });

  const family: Family = {
    id: listData.id,
    name: listData.name,
    owner_id: listData.user_id,
    members: Array.from(membersMap.values()),
  };

  console.log("Current User ID:", user.id);
  console.log("Family Members:", family.members);

  return (
    <FamilyListClient initialFamily={family} initialUser={user} familyId={resolvedParams.familyId} />
  )
}
