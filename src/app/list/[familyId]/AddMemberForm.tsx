import { createClient } from '@/lib/supabase'
import { useState } from 'react'
// import { useRouter } from 'next/navigation' // No longer needed

interface AddMemberFormProps {
  familyId: string;
  currentUserId: string;
  members: { id: string; name: string }[];
  onClose: () => void; // Add onClose prop
  onMemberAdded: () => Promise<void>; // New prop to refresh family list
}

export default function AddMemberForm({ familyId, currentUserId, members, onClose, onMemberAdded }: AddMemberFormProps) {
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('') // Assuming email for finding user ID
  const [message, setMessage] = useState('')
  const supabase = createClient()
  // const router = useRouter() // No longer needed

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    console.log("Attempting to add member:", { newMemberName, newMemberEmail, familyId, currentUserId });

    if (!newMemberName || !newMemberEmail) {
      setMessage('Member name and email are required.')
      return
    }

    // First, check if the current user is part of this family list
    const isCurrentUserMember = members.some(member => member.id === currentUserId);
    if (!isCurrentUserMember) {
      setMessage('You must be a member of this list to add new members.');
      return;
    }

    try {
      const res = await fetch(`/api/lists/${familyId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName: newMemberName, memberEmail: newMemberEmail }),
      });

      console.log("API response status:", res.status);
      const data = await res.json();
      console.log("API response data:", data);

      if (res.ok) {
        setMessage(data.message);
        setNewMemberName('');
        setNewMemberEmail('');
        await onMemberAdded(); // Refresh the current page to show the new member in the dropdowns
        onClose(); // Close the modal after adding member
      } else {
        setMessage(`Failed to add member: ${data.error}`);
      }
    } catch (error: unknown) {
      let errorMessage = 'Error adding member';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setMessage(`Error adding member: ${errorMessage}`);
      console.error("Error during add member fetch:", error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-semibold mb-4">Add New Family Member</h3>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label htmlFor="newMemberName" className="block text-sm font-medium text-gray-300">Member Name</label>
            <input
              type="text"
              id="newMemberName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newMemberEmail" className="block text-sm font-medium text-gray-300">Member Email</label>
            <input
              type="email"
              id="newMemberEmail"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  )
}
