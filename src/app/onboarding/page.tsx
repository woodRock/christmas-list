// src/app/onboarding/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function OnboardingPage() {
  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Christmas List!</h1>
        <p className="mb-6">Here&apos;s a quick guide to help you get started and manage your lists:</p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Managing Gifts</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Add Items:</strong> Click the <Image src="/gift.svg" alt="Add Gift" width={16} height={16} className="inline-block" /> &quot;Add Gift&quot; button to add a new item to your list. You can include details like description, price, and a product link.
            </li>
            <li>
              <strong>Edit Items:</strong> Double-click on any gift item to open the edit form. You can update its details, notes, or product information.
            </li>
            <li>
              <strong>Delete Items:</strong> In list view, drag an item to the trash bin that appears at the bottom of the screen. In grid view, you can also drag items to the trash bin.
            </li>
            <li>
              <strong>Claim/Unclaim Items:</strong> If you&apos;re a member of a list, you can claim an item by clicking the <Image src="/cart.svg" alt="Claim Gift" width={16} height={16} className="inline-block" /> cart icon. Click it again to unclaim.
            </li>
            <li>
              <strong>View Product Link:</strong> Click the <Image src="/link.svg" alt="Open Link" width={16} height={16} className="inline-block" /> link icon to open the product link in a new tab.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Managing Members &amp; Invites</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Add Members:</strong> If you own the list, click the <Image src="/add-user.svg" alt="Add Member" width={16} height={16} className="inline-block" /> &quot;Add Member&quot; button to add existing users to your list.
            </li>
            <li>
              <strong>Invite Members:</strong> Click the <Image src="/qr_code.svg" alt="Invite" width={16} height={16} className="inline-block" /> &quot;Invite&quot; button to generate a QR code or copy an invite link. Share this with others to let them join your list.
            </li>
            <li>
              <strong>Remove Members:</strong> As the list owner, you can remove members from their list by clicking the &quot;Remove&quot; button next to their name.
            </li>
          </ul>
        </section>

        <Link href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-block">
          ← Back to My Lists
        </Link>
      </div>
    </div>
  );
}