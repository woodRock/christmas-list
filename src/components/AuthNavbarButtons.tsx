'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase'; // Client-side Supabase client

export default function AuthNavbarButtons() {
  const [user, setUser] = useState<any | null>(null); // Use 'any' for user type for now, or define a more specific type
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Initial check
    supabase.auth.getUser().then(({ data: { user: initialUser } }) => {
      setUser(initialUser || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {user ? (
        <>
          <Link href="/onboarding" className="flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-200 transition-colors" aria-label="Help">
            <Image src="/question.svg" alt="Help" width={16} height={16} />
          </Link>
          <Link href="/claimed-items" className="flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-200 transition-colors" aria-label="Cart">
            <Image src="/cart.svg" alt="Cart" width={16} height={16} />
          </Link>
          <LogoutButton />
        </>
      ) : (
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
          Login
        </Link>
      )}
    </>
  );
}
