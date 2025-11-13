'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Member {
  id: string;
  name: string;
}

interface AddGiftFormProps {
  familyId: string;
  currentUserId: string;
  members: Member[];
}

export default function AddGiftForm({ familyId, currentUserId, members }: AddGiftFormProps) {
  const [newGiftDescription, setNewGiftDescription] = useState('')
  const [newGiftNotes, setNewGiftNotes] = useState('')
  const [newGiftPrice, setNewGiftPrice] = useState<string>('')
  const [selectedRecipientId, setSelectedRecipientId] = useState(currentUserId) // Default to current user
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!newGiftDescription) {
      setMessage('Gift description is required.')
      return
    }

    if (!selectedRecipientId) {
      setMessage('Please select a recipient.')
      return
    }

    // Get the current max order_index for the list
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('items')
      .select('order_index')
      .eq('list_id', familyId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextOrderIndex = maxOrderData ? maxOrderData.order_index + 1 : 0;

    const { error } = await supabase
      .from('items')
      .insert([{
        list_id: familyId,
        user_id: selectedRecipientId,
        name: newGiftDescription,
        notes: newGiftNotes || null,
        price: newGiftPrice ? parseFloat(newGiftPrice) : null,
        order_index: nextOrderIndex
      }])

    if (error) {
      setMessage(`Failed to add gift: ${error.message}`)
    } else {
      setMessage(`Gift "${newGiftDescription}" added successfully!`)
      setNewGiftDescription('')
      setNewGiftNotes('')
      setNewGiftPrice('')
      router.refresh() // Refresh the current page to show the new gift
    }
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3">Add a Gift</h3>
      {message && <p className="text-red-500 mb-3">{message}</p>}
      <form onSubmit={handleAddGift} className="space-y-3">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-300">Recipient</label>
          <select
            id="recipient"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedRecipientId}
            onChange={(e) => setSelectedRecipientId(e.target.value)}
            required
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} {member.id === currentUserId ? '(You)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gift-desc" className="block text-sm font-medium text-gray-300">
            Gift Description
          </label>
          <input
            type="text"
            id="gift-desc"
            placeholder="Gift description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newGiftDescription}
            onChange={(e) => setNewGiftDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="gift-notes" className="block text-sm font-medium text-gray-300">
            Notes (Optional)
          </label>
          <textarea
            id="gift-notes"
            placeholder="e.g., Size M, color blue, link to product"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newGiftNotes}
            onChange={(e) => setNewGiftNotes(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gift-price" className="block text-sm font-medium text-gray-300">
            Price (Optional)
          </label>
          <input
            type="number"
            id="gift-price"
            placeholder="e.g., 25.99"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newGiftPrice}
            onChange={(e) => setNewGiftPrice(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Add Gift
        </button>
      </form>
    </div>
  )
}
