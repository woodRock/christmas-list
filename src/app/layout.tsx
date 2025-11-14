import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import AuthNavbarButtons from "@/components/AuthNavbarButtons"; // Import the new client component

export const metadata: Metadata = {
  title: "Giftd",
  description: "Manage your family's Christmas/Birthday lists",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove user fetching logic from here, it's now handled in AuthNavbarButtons
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 p-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Giftd
            </Link>
            <div className="flex items-center space-x-4">
              <AuthNavbarButtons /> {/* Render the client component here */}
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
