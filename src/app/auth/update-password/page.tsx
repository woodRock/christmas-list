'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input } from '@/components/ui/Field'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const [supabase] = useState(createClient)

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
