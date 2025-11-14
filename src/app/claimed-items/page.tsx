import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // Import headers
import ClaimedItemsClient from './ClaimedItemsClient';

interface ClaimedItem {
  id: string;
  name: string;
  notes?: string;
  price?: number;
  product_url?: string;
  product_title?: string;
  product_image_url?: string;
}

export default async function ClaimedItemsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const headersList = await headers(); // Await headers()
  const forwardedHeaders: HeadersInit = {};
  headersList.forEach((value, key) => {
    forwardedHeaders[key] = value;
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/claimed-items`, {
    headers: forwardedHeaders, // Pass all headers, including the original cookie
    cache: 'no-store', // Ensure fresh data
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error fetching claimed items from API:", errorData);
    return <p className="text-red-500 text-center">Error loading claimed items: {errorData.error}</p>;
  }

  const claimedItems: ClaimedItem[] = await res.json();

  return (
    <ClaimedItemsClient claimedItems={claimedItems} />
  );
}
