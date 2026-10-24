import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ErrorState from '@/components/ui/ErrorState'
import ListSettingsClient from './ListSettingsClient'

interface ProfileInListMember {
  full_name: string;
}

interface ListMember {
  profile_id: string;
  profiles: ProfileInListMember[];
}

interface Member {
  id: string;
  name: string;
}

interface Family {
  id: string;
  name: string;
  owner_id: string;
  members: Member[];
}

export default async function ListSettingsPage({ params }: { params: { familyId: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id, list_members(profile_id, profiles(full_name))')
    .eq('id', resolvedParams.familyId)
    .single()

  if (listError) {
    console.error("Error loading family list:", listError);
    return <ErrorState title="We couldn’t open this list" message={listError.message} />
  }

  if (!listData) {
    return <ErrorState title="List not found" />
  }

  const isOwner = listData.user_id === user.id;

  if (!isOwner) {
    redirect(`/list/${resolvedParams.familyId}`) // Only owner can access settings
  }

  // Fetch all profiles to build the members list for the client component
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', listData.list_members.map((lm: ListMember) => lm.profile_id).concat(listData.user_id)); // Include owner

  if (profilesError) {
    console.error("Error loading profiles:", profilesError);
    return <ErrorState title="We couldn’t load this list’s members" message={profilesError.message} />
  }

  const members: Member[] = profilesData.map(profile => ({
    id: profile.id,
    name: profile.full_name,
  }));

  const initialFamily: Family = {
    id: listData.id,
    name: listData.name,
    owner_id: listData.user_id,
    members: members,
  };

  return (
    <ListSettingsClient initialFamily={initialFamily} currentUserId={user.id} />
  )
}
