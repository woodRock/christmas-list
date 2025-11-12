import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: "Christmas List App",
  description: "Manage your family's Christmas lists",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 p-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Christmas List App
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span>Hello, {user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
