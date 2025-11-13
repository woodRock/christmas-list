'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

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
          className="p-2 text-purple-600 rounded-full hover:bg-purple-100 transition-colors flex items-center justify-center"
          aria-label="Claim Gift"
        >
          <Image src="/cart.svg" alt="Claim Gift" width={24} height={24} />
        </button>
      )}
      {gift.is_purchased && gift.purchased_by === userId && (
        <button
          onClick={handleUnclaimGift}
          className="p-2 text-yellow-600 rounded-full hover:bg-yellow-100 transition-colors flex items-center justify-center"
          aria-label="Unclaim Gift"
        >
          <Image src="/cart.svg" alt="Unclaim Gift" width={24} height={24} />
        </button>
      )}
    </div>
  )
}
