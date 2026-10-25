'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KeyRound, Link2Off, Loader2, MonitorSmartphone } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { usePasswordResetRequest } from '@/lib/usePasswordResetRequest'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input } from '@/components/ui/Field'

// What arrived with the page: a working session, or a reason we can't use it.
type LinkState = 'checking' | 'ready' | 'expired' | 'other-browser' | 'signed-out'

const INVALID_COPY: Record<'expired' | 'other-browser' | 'signed-out', { icon: React.ReactNode; title: string; body: React.ReactNode }> = {
  expired: {
    icon: <Link2Off className="h-7 w-7" aria-hidden />,
    title: 'This reset link has expired',
    body: 'Reset links work once, and asking for another email cancels the previous one. Send yourself a fresh link below and open the newest email.',
  },
  'other-browser': {
    icon: <MonitorSmartphone className="h-7 w-7" aria-hidden />,
    title: 'Open the link in the same browser',
    body: (
      <>
        For your security, a reset link only works in the browser you asked for it from. Send a new link from here, then
        open it in this browser. If your email app opens a different one, copy the link and paste it into this browser’s address bar.
      </>
    ),
  },
  'signed-out': {
    icon: <KeyRound className="h-7 w-7" aria-hidden />,
    title: 'Reset your password',
    body: 'We’ll email you a link to choose a new password.',
  },
}

export default function UpdatePassword() {
  const [linkState, setLinkState] = useState<LinkState>('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const [supabase] = useState(createClient)
  const reset = usePasswordResetRequest(supabase)

  useEffect(() => {
    const checkLink = async () => {
      // Supabase reports a dead link with error params in the query or hash.
      const query = new URLSearchParams(window.location.search)
      const hash = new URLSearchParams(window.location.hash.slice(1))
      const linkError = query.get('error_code') || hash.get('error_code') || query.get('error') || hash.get('error')
      const hadCode = query.has('code')

      // The browser client exchanges ?code= for a session while initialising;
      // getUser() waits for that.
      const { data } = await supabase.auth.getUser()
      window.history.replaceState(null, '', window.location.pathname)

      if (data.user) setLinkState('ready')
      else if (linkError) setLinkState('expired')
      else if (hadCode) setLinkState('other-browser')
      else setLinkState('signed-out')
    }
    checkLink()
  }, [supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password.length < 6) {
      setMessage({ tone: 'error', text: 'Password must be at least 6 characters long.' })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ tone: 'error', text: 'Passwords do not match.' })
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (error) {
      setMessage({ tone: 'error', text: error.message })
    } else {
      setMessage({ tone: 'success', text: 'Your password has been updated. Taking you back to your lists…' })
      setTimeout(() => router.push('/'), 2000)
    }
  }

  if (linkState === 'checking') {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted" aria-label="Checking your reset link" />
      </div>
    )
  }

  if (linkState !== 'ready') {
    const copy = INVALID_COPY[linkState]
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">{copy.icon}</span>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{copy.title}</h1>
          <p className="mt-2 text-[15px] text-muted">{copy.body}</p>
        </div>
        <Card className="p-5 sm:p-7">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              reset.send(email.trim())
            }}
            className="space-y-4"
          >
            <Field label="Email" htmlFor="reset-email">
              <Input id="reset-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            {reset.status && <Alert tone={reset.status.tone}>{reset.status.text}</Alert>}
            <Button type="submit" size="lg" className="w-full" loading={reset.sending} disabled={reset.secondsLeft > 0}>
              {reset.secondsLeft > 0 ? `Send another in ${reset.secondsLeft}s` : 'Send a new reset link'}
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-muted">
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <KeyRound className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Set a new password</h1>
        <p className="mt-2 text-[15px] text-muted">Choose something you haven&apos;t used elsewhere.</p>
      </div>
      <Card className="p-5 sm:p-7">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <Field label="New password" htmlFor="password" hint="At least 6 characters.">
            <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
          </Field>
          <Field label="Confirm new password" htmlFor="confirmPassword">
            <Input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </Field>
          {message && <Alert tone={message.tone}>{message.text}</Alert>}
          <Button type="submit" size="lg" className="w-full" loading={submitting}>Update password</Button>
        </form>
      </Card>
    </div>
  )
}
