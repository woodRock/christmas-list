import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  if (profileError || !profileData) {
    console.error("Error fetching profile:", profileError);
    // Handle case where profile might not exist yet, or error
    // For now, we'll use a default name if not found
    const defaultProfile: UserProfile = {
      id: user.id,
      full_name: user.email || 'User', // Fallback to email if full_name not found
      email: user.email || '',
    };
    return <ProfileClient initialProfile={defaultProfile} />;
  }

  const userProfile: UserProfile = {
    id: user.id,
    full_name: profileData.full_name,
    email: user.email || '',
  };

  return (
    <ProfileClient initialProfile={userProfile} />
  );
}
