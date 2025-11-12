'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Gift {
  id: string;
  description: string;
}

interface EditGiftFormProps {
  gift: Gift;
  onClose: () => void;
  onSave: () => void;
}

export default function EditGiftForm({ gift, onClose, onSave }: EditGiftFormProps) {
  const [newDescription, setNewDescription] = useState(gift.description)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!newDescription) {
      setMessage('Gift description cannot be empty.')
      return
    }

    const res = await fetch(`/api/gifts/${gift.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newDescription }),
    })

    if (res.ok) {
      setMessage('Gift updated successfully!')
      onSave()
    } else {
      const errorText = await res.text()
      setMessage(`Failed to update gift: ${errorText}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Gift</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gift-description" className="block text-sm font-medium text-gray-700">Gift Description</label>
            <input
              type="text"
              id="gift-description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
