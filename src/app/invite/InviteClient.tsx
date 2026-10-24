'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Gift, Link2Off, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'

export default function InviteClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(createClient)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const redirect = encodeURIComponent(`/invite?token=${token}`)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [supabase])

  const handleAcceptInvite = async () => {
    if (!token) return
    setAccepting(true)
    setError(null)

    const res = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (res.ok) {
      const { listId } = await res.json()
      router.push(`/list/${listId}`)
    } else {
      const { error } = await res.json().catch(() => ({ error: null }))
      setError(error || 'We couldn’t accept this invite. It may have expired — ask for a new link.')
      setAccepting(false)
    }
  }

  if (!token) {
    return (
      <Card className="mx-auto mt-10 max-w-md">
        <EmptyState
          icon={<Link2Off className="h-6 w-6" />}
          title="This invite link isn't complete"
          description="Ask the person who invited you to send the link again, or scan their QR code."
        />
      </Card>
    )
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
      <Card className="p-6 text-center sm:p-8">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Gift className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">You&apos;re invited!</h1>
        <p className="mx-auto mt-2 max-w-xs text-[15px] text-muted">
          Join the list to add your wishes and see what everyone else would love this year.
        </p>

        <div className="mt-7">
          {loading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted" aria-label="Loading" />
          ) : user ? (
            <Button size="lg" className="w-full" onClick={handleAcceptInvite} loading={accepting}>
              Join the list
            </Button>
          ) : (
            <div className="space-y-2">
              <Button size="lg" className="w-full" onClick={() => router.push(`/login?mode=signup&redirect=${redirect}`)}>
                Create an account to join
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.push(`/login?redirect=${redirect}`)}>
                I already have an account
              </Button>
            </div>
          )}
        </div>
        {error && <Alert className="mt-4 text-left">{error}</Alert>}
      </Card>
    </div>
  )
}
