import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AddGiftForm from './AddGiftForm' // Client component for adding gifts
import ClaimUnclaimButtons from './ClaimUnclaimButtons' // Client component for claim/unclaim buttons
import AddMemberForm from './AddMemberForm' // Client component for adding members

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
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
  if (!params.familyId) {
    redirect('/'); // Redirect to home if familyId is not provided
  }
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id, list_members(profile_id, profiles(full_name))')
    .eq('id', params.familyId)
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
    .select('id, name, is_purchased, purchased_by, user_id')
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
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4">{family.name} Christmas List</h1>
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</Link>

        {family.members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">{member.name}'s List</h2>
            {member.gifts.length === 0 ? (
              <p>No gifts on {member.name}'s list yet.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {member.gifts.map((gift) => (
                  <li key={gift.id} className="flex justify-between items-center">
                    <span>
                      {gift.description}
                      {gift.is_purchased && user.id !== gift.user_id && (
                        <span className="ml-2 text-sm text-green-600">
                          (Claimed by {family.members.find(m => m.id === gift.purchased_by)?.name})
                        </span>
                      )}
                    </span>
                    {user && user.id !== gift.user_id && (
                      <ClaimUnclaimButtons
                        gift={gift}
                        userId={user.id}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {user && (
          <AddGiftForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
          />
        )}

        {user && (
          <AddMemberForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
          />
        )}
      </div>
    </div>
  )
}
