'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AddMemberFormProps {
  familyId: string;
  currentUserId: string;
  members: { id: string; name: string }[];
}

export default function AddMemberForm({ familyId, currentUserId, members }: AddMemberFormProps) {
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('') // Assuming email for finding user ID
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

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
      const res = await fetch(`/api/family/${familyId}/members`, {
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
        router.refresh(); // Refresh the page to show the new member in the dropdowns
      } else {
        setMessage(`Failed to add member: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Error adding member: ${error.message}`);
      console.error("Error during add member fetch:", error);
    }
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Add New Family Member</h3>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleAddMember} className="space-y-4">
        <div>
          <label htmlFor="newMemberName" className="block text-sm font-medium text-gray-700">Member Name</label>
          <input
            type="text"
            id="newMemberName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newMemberEmail" className="block text-sm font-medium text-gray-700">Member Email</label>
          <input
            type="email"
            id="newMemberEmail"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
  )
}
