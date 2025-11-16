'use client'

import { useState } from 'react'
import IconButton from '@/components/IconButton'

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
  refreshFamily: () => Promise<void>;
}

export default function ClaimUnclaimButtons({ gift, userId, refreshFamily }: ClaimUnclaimButtonsProps) {
  const [message, setMessage] = useState('')

  const handleClaimGift = async () => {
    setMessage('')
    const res = await fetch(`/api/gifts/${gift.id}/claim`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimedByUserId: userId }),
    })

    if (res.ok) {
      setMessage('Gift claimed successfully!')
      refreshFamily()
    } else {
      const errorText = await res.text()
      setMessage(`Failed to claim gift: ${errorText}`)
    }
  }

  const handleUnclaimGift = async () => {
    setMessage('')
    const res = await fetch(`/api/gifts/${gift.id}/unclaim`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      setMessage('Gift unclaimed successfully!')
      refreshFamily()
    } else {
      const errorText = await res.text()
      setMessage(`Failed to unclaim gift: ${errorText}`)
    }
  }

  return (
    <>
      {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
      {!gift.is_purchased && (
        <IconButton
          onClick={handleClaimGift}
          src="/cart.svg"
          alt="Claim Gift"
          ariaLabel="Claim Gift"
          className="text-purple-600 hover:bg-purple-100"
        />
      )}
      {gift.is_purchased && gift.purchased_by === userId && (
        <IconButton
          onClick={handleUnclaimGift}
          src="/cart.svg"
          alt="Unclaim Gift"
          ariaLabel="Unclaim Gift"
          className="text-yellow-600 hover:bg-yellow-100"
        />
      )}
    </>
  )
}
