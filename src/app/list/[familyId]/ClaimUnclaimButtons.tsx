'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
}

interface ClaimUnclaimButtonsProps {
  gift: Gift;
  userId: string;
}

export default function ClaimUnclaimButtons({ gift, userId }: ClaimUnclaimButtonsProps) {
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleClaimGift = async () => {
    setMessage('')
    const res = await fetch(`/api/gifts/${gift.id}/claim`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimedByUserId: userId }),
    })

    if (res.ok) {
      setMessage('Gift claimed successfully!')
      router.refresh()
    } else {
      const errorText = await res.text()
      setMessage(`Failed to claim gift: ${errorText}`)
    }
  }

  const handleUnclaimGift = async () => {
    setMessage('')
    const res = await fetch(`/api/gifts/${gift.id}/unclaim`, {
      method: 'PATCH', // Changed to PATCH as per API route
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      setMessage('Gift unclaimed successfully!')
      router.refresh()
    } else {
      const errorText = await res.text()
      setMessage(`Failed to unclaim gift: ${errorText}`)
    }
  }

  return (
    <div>
      {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
      {!gift.is_purchased && (
        <button
          onClick={handleClaimGift}
          className="ml-4 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
        >
          Claim
        </button>
      )}
      {gift.is_purchased && gift.purchased_by === userId && (
        <button
          onClick={handleUnclaimGift}
          className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
        >
          Unclaim
        </button>
      )}
    </div>
  )
}
