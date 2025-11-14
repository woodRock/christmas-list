import { NextResponse, NextRequest } from 'next/server';

interface RouteContext {
  params: Promise<{
    familyId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const params = await context.params; // Await the promise
  const { familyId } = params;

  // In a real application, you would fetch data from a database here
  // For now, we'll return a placeholder
  const placeholderFamily = {
    id: familyId,
    name: `Family ${familyId}`,
    owner_id: 'placeholder_owner_id',
    members: [
      {
        id: 'member1',
        name: 'Member 1',
        gifts: [
          { id: 'gift1', description: 'Gift 1', is_purchased: false, user_id: 'member1' },
          { id: 'gift2', description: 'Gift 2', is_purchased: true, user_id: 'member1' },
        ],
      },
      {
        id: 'member2',
        name: 'Member 2',
        gifts: [
          { id: 'gift3', description: 'Gift 3', is_purchased: false, user_id: 'member2' },
        ],
      },
    ],
  };

  return NextResponse.json(placeholderFamily);
}