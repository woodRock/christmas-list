'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateFamily() {
  const [familyName, setFamilyName] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMessage('You must be logged in to create a family list.')
      return
    }

    const { data: list, error: listError } = await supabase
      .from('lists')
      .insert([{ name: familyName, user_id: user.id }])
      .select()
      .single()

    if (listError) {
      setMessage(listError.message)
      return
    }

    // Add the list owner to the list_members table
    const { error: memberError } = await supabase
      .from('list_members')
      .insert([{ list_id: list.id, profile_id: user.id, role: 'owner' }])

    if (memberError) {
      setMessage(memberError.message)
      return
    }

    setMessage(`Family "${list.name}" created successfully!`)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Create New Family List</h1>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleCreateFamily} className="space-y-4">
          <div>
            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700">Family Name</label>
            <input
              type="text"
              id="familyName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Family
          </button>
        </form>
      </div>
    </div>
  )
}
