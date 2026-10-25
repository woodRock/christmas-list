'use client'

import { useEffect, useState } from 'react'
import type { AuthError, SupabaseClient } from '@supabase/supabase-js'

const COOLDOWN_SECONDS = 60

/** Turns Supabase's email-sending errors into something a person can act on. */
export function friendlyEmailError(error: Pick<AuthError, 'message' | 'code' | 'status'>) {
  const wait = error.message.match(/after (\d+) seconds?/)
  if (wait) return `Please wait ${wait[1]} seconds before asking for another email.`
  if (error.code === 'over_email_send_rate_limit' || error.status === 429) {
    return 'Too many emails have been sent recently. Please try again in a few minutes.'
  }
  return error.message
}

type Status = { tone: 'error' | 'success'; text: string } | null

/**
 * Sends a password reset email, then locks for a minute. Each new email
 * invalidates the previous link, so repeat taps would leave people holding a
 * dead link.
 */
export function usePasswordResetRequest(supabase: SupabaseClient) {
  const [sending, setSending] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [status, setStatus] = useState<Status>(null)

  useEffect(() => {
    if (cooldownUntil <= Date.now()) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [cooldownUntil])

  const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000))

  const send = async (email: string) => {
    if (sending || secondsLeft > 0) return
    if (!email) {
      setStatus({ tone: 'error', text: 'Enter your email first.' })
      return
    }

    setSending(true)
    setStatus(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    setSending(false)

    if (error) {
      setStatus({ tone: 'error', text: friendlyEmailError(error) })
      return
    }
    setNow(Date.now())
    setCooldownUntil(Date.now() + COOLDOWN_SECONDS * 1000)
    setStatus({
      tone: 'success',
      text: `Reset link sent to ${email}. Open the newest email, in this same browser — older links stop working.`,
    })
  }

  return { send, sending, secondsLeft, status, setStatus }
}
