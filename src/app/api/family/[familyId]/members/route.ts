import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ familyId: string }> }
) {
  console.log("POST /api/family/[familyId]/members reached!");
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("Returning Unauthorized: No user session.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { familyId } = await context.params;
  const { memberName, memberEmail } = await request.json()
  console.log("Request body:", { familyId, memberName, memberEmail });

  if (!memberName || !memberEmail) {
    console.log("Validation error: Member name and email are required.");
    console.log("Returning Invalid request body.");
    return NextResponse.json({ error: 'Member name and email are required' }, { status: 400 })
  }

  // Verify the logged-in user belongs to the list
  const { data: isMember, error: memberError } = await supabase
    .from('list_members')
    .select('role')
    .eq('list_id', familyId)
    .eq('profile_id', user.id)
    .single()
  console.log("Is current user a member of the list?", isMember, memberError);

  if (memberError || !isMember) {
    console.log("Unauthorized: Current user is not a member of this list.");
    console.log("Returning Unauthorized: Not a member of this list.");
    return NextResponse.json({ error: 'Unauthorized: You are not a member of this list' }, { status: 403 })
  }

  // Find the user ID for the given email
  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('profiles')
    .select('id, full_name') // Select full_name to use for profile creation if needed
    .eq('full_name', memberName)
    .single()
  console.log("Existing profile found by name:", existingProfile, existingProfileError);

  let newMemberProfileId = existingProfile?.id;
  let newMemberFullName = existingProfile?.full_name;

  if (existingProfileError || !newMemberProfileId) {
    console.log("Profile not found by name, trying by email in auth.users.");
    // If profile not found by name, try to find by email in auth.users (if they have signed up)
    const { data: authUser, error: authUserError } = await supabase.auth.admin.inviteUserByEmail(memberEmail);
    console.log("Auth user found by email:", authUser, authUserError);
    if (authUserError || !authUser?.user) {
      console.log("Could not find a registered user with that email.");
      console.log("Returning User not found.");
      return NextResponse.json({ error: 'Could not find a registered user with that email. Please ensure they have signed up.' }, { status: 404 });
    }
    newMemberProfileId = authUser.user.id;
    newMemberFullName = authUser.user.user_metadata.full_name || memberName; // Use full_name from auth or provided name

    // If the profile doesn't exist in our 'profiles' table, create it.
    const { error: createProfileError } = await supabase
      .from('profiles')
      .insert([{ id: newMemberProfileId, full_name: newMemberFullName }]);
    console.log("Profile creation result:", createProfileError);
    if (createProfileError) {
      console.log("Returning Failed to create profile.");
      return NextResponse.json({ error: `Failed to create profile: ${createProfileError.message}` }, { status: 500 });
    }
  }

  // Check if the member is already in the list_members table
  const { data: existingListMember, error: existingListMemberError } = await supabase
    .from('list_members')
    .select('list_id, profile_id')
    .eq('list_id', familyId)
    .eq('profile_id', newMemberProfileId)
    .single()
  console.log("Existing list member check:", existingListMember, existingListMemberError);

  if (existingListMember && !existingListMemberError) {
    console.log("Member already in list_members table.");
    console.log("Returning Member already in list.");
    return NextResponse.json({ message: `Member "${memberName}" is already a member of this list.` }, { status: 200 })
  }

  // Add the new member to the list_members table
  const { error: addMemberError } = await supabase
    .from('list_members')
    .insert([{ list_id: familyId, profile_id: newMemberProfileId, role: 'member' }]);
  console.log("Add member to list_members result:", addMemberError);

  if (addMemberError) {
    console.log("Returning Failed to add member to list.");
    return NextResponse.json({ error: `Failed to add member to list: ${addMemberError.message}` }, { status: 500 });
  }

  console.log("Returning Member added successfully.");
  return NextResponse.json({ message: `Member "${memberName}" added successfully!` })
}
