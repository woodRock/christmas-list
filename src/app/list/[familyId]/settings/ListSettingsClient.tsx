'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddMemberForm from '../AddMemberForm' // Assuming this path is correct
import Link from 'next/link'

interface Member {
  id: string;
  name: string;
}

interface Family {
  id: string;
  name: string;
  owner_id: string;
  members: Member[];
}

interface ListSettingsClientProps {
  initialFamily: Family;
  currentUserId: string;
}

export default function ListSettingsClient({ initialFamily, currentUserId }: ListSettingsClientProps) {
  const [family, setFamily] = useState<Family>(initialFamily)
  const [listName, setListName] = useState(initialFamily.name)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('')
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const refreshFamily = async () => {
    const res = await fetch(`/api/lists/${family.id}/details`);
    if (res.ok) {
      const updatedFamily = await res.json();
      setFamily(updatedFamily);
      setListName(updatedFamily.name); // Also update listName state
    } else {
      console.error('Failed to refresh family data');
      setMessage('Failed to refresh family data.');
    }
  };

  const handleUpdateListName = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!listName.trim()) {
      setMessage('List name cannot be empty.')
      return
    }

    const res = await fetch(`/api/lists/${family.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: listName }),
    })

    if (res.ok) {
      setMessage('List name updated successfully!')
      refreshFamily() // Refresh to update the family state
    } else {
      const errorText = await res.text()
      setMessage(`Failed to update list name: ${errorText}`)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member? This will delete all of their gifts from the list.')) return

    setMessage('')
    const res = await fetch(`/api/lists/${family.id}/members/${memberId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setMessage('Member removed successfully!')
      refreshFamily() // Refresh to update the family state
    } else {
      const errorText = await res.text()
      setMessage(`Failed to remove member: ${errorText}`)
    }
  }

  const handleDeleteList = async () => {
    setMessage('')
    if (deleteConfirmationInput !== family.name) {
      setMessage('The list name you typed does not match. Please try again.')
      return
    }

    const res = await fetch(`/api/lists/${family.id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      alert('List deleted successfully!')
      router.push('/') // Redirect to home page after deletion
    } else {
      const errorText = await res.text()
      setMessage(`Failed to delete list: ${errorText}`)
    }
  }

  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">List Settings for &quot;{family.name}&quot;</h1>
        <Link href={`/list/${family.id}`} className="text-blue-500 hover:underline mb-4 block">← Back to List</Link>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {/* Change List Name */}
        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Change List Name</h2>
          <form onSubmit={handleUpdateListName} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
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

        {/* Manage Members */}
        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Manage Members</h2>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm mb-4"
          >
            Add New Member
          </button>

          <ul className="space-y-2">
            {family.members.map(member => (
              <li key={member.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <span>{member.name} {member.id === currentUserId ? '(You)' : ''}</span>
                {member.id !== family.owner_id && ( // Cannot remove the owner
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Delete List */}
        <section className="mb-8 p-4 border rounded-lg bg-red-50 dark:bg-red-900">
          <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-red-200">Delete List</h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            Deleting this list is permanent and cannot be undone. All gifts and members associated with this list will be removed.
          </p>
          <button
            onClick={() => setShowDeleteConfirmModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Delete This List
          </button>
        </section>

        {/* Modals */}
        {showAddMemberModal && (
          <AddMemberForm
            familyId={family.id}
            currentUserId={currentUserId}
            members={family.members}
            onClose={() => setShowAddMemberModal(false)}
            onMemberAdded={refreshFamily}
          />
        )}

        {showDeleteConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-bold mb-4">Confirm List Deletion</h2>
              <p className="mb-4">
                To confirm deletion, please type the name of the list &quot;<strong>{family.name}</strong>&quot; below:
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
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteList}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={deleteConfirmationInput !== family.name}
                >
                  I Understand, Delete List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
