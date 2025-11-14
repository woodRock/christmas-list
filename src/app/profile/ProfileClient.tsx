'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
}

interface ProfileClientProps {
  initialProfile: UserProfile;
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [newName, setNewName] = useState(initialProfile.full_name);
  const [message, setMessage] = useState('');
  const [showDeleteGiftsModal, setShowDeleteGiftsModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const router = useRouter();

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!newName.trim()) {
      setMessage('Name cannot be empty.');
      return;
    }

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: newName.trim() }),
    });

    if (res.ok) {
      setMessage('Profile name updated successfully!');
      setProfile(prev => ({ ...prev, full_name: newName.trim() }));
    } else {
      const errorText = await res.text();
      setMessage(`Failed to update name: ${errorText}`);
    }
  };

  const handleDeleteAllGifts = async () => {
    setMessage('');
    if (deleteConfirmationInput !== profile.full_name) {
      setMessage('Your full name does not match. Please try again.');
      return;
    }

    const res = await fetch('/api/profile/delete-gifts', {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('All your gifts have been deleted successfully!');
      setShowDeleteGiftsModal(false);
      setDeleteConfirmationInput('');
      // Optionally, redirect or refresh the page to reflect changes
      router.refresh();
    } else {
      const errorText = await res.text();
      setMessage(`Failed to delete gifts: ${errorText}`);
    }
  };

  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</Link>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {/* Display Profile Info */}
        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
          <p className="mb-4"><strong>Current Name:</strong> {profile.full_name}</p>

          <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Update Name
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Account Security</h2>
          <p className="mb-4">You can change your password through the dedicated password update page.</p>
          <Link href="/auth/update-password" className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm">
            Change Password
          </Link>
        </section>

        {/* Delete All Gifts */}
        <section className="mb-8 p-4 border rounded-lg bg-red-50 dark:bg-red-900">
          <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-red-200">Delete All My Gifts</h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            This action is permanent and cannot be undone. All gifts you have added to any list will be deleted.
          </p>
          <button
            onClick={() => setShowDeleteGiftsModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Delete All My Gifts
          </button>
        </section>

        {/* Delete Gifts Confirmation Modal */}
        {showDeleteGiftsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-bold mb-4">Confirm Gift Deletion</h2>
              <p className="mb-4">
                To confirm deletion of ALL your gifts, please type your full name &quot;<strong>{profile.full_name}</strong>&quot; below:
              </p>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm mb-4"
              />
              {message && <p className="text-red-500 mb-4">{message}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteGiftsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllGifts}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={deleteConfirmationInput !== profile.full_name}
                >
                  I Understand, Delete All Gifts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
