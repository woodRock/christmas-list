'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase' // Correct client-side Supabase client
import { useRouter, useSearchParams } from 'next/navigation' // Import useSearchParams

export default function InviteClient() { // Not async
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient() // No await here
  const router = useRouter()
  const searchParams = useSearchParams() // Get search params
  const token = searchParams.get('token') // Get token from search params

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [supabase.auth])

  const handleAcceptInvite = async () => {
    if (!token) { // Check if token exists
      setError('Invalid invite link. No token provided.')
      return
    }

    if (!user) {
      router.push(`/login?redirect=/invite?token=${token}`)
      return
    }

    const res = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }), // Use 'token' directly
    })

    if (res.ok) {
      const { listId } = await res.json()
      router.push(`/list/${listId}`)
    } else {
      const { error } = await res.json()
      setError(error || 'Failed to accept invite.')
    }
  }

  if (!token) { // Display error if no token
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Invalid invite link. No token provided.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">You've been invited!</h1>
      {user ? (
        <p className="mb-4">Accept the invite to join the list.</p>
      ) : (
        <p className="mb-4">Please log in or sign up to accept the invite.</p>
      )}
      <button
        onClick={handleAcceptInvite}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {user ? 'Accept Invite' : 'Login to Accept'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
