'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Gift } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input } from '@/components/ui/Field'
import { cn } from '@/components/ui/cn'

type Mode = 'login' | 'signup'
type Message = { tone: 'error' | 'success'; text: string } | null

export default function LoginClient({ redirectUrl = '/', initialMode = 'login' }: { redirectUrl?: string; initialMode?: Mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<Message>(null)
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<Mode>(initialMode)
  const router = useRouter()
  const [supabase] = useState(createClient)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() } },
      })
      setSubmitting(false)
      if (error) {
        setMessage({ tone: 'error', text: error.message })
      } else {
        // Supabase handles the email confirmation flow, then redirects back.
        setMessage({ tone: 'success', text: `Almost there! We sent a confirmation link to ${email}. Open it to finish creating your account.` })
      }
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setSubmitting(false)
      setMessage({ tone: 'error', text: error.message })
    } else {
      router.push(redirectUrl)
      router.refresh()
    }
  }

  const handleResetPassword = async () => {
    setMessage(null)
    if (!email) {
      setMessage({ tone: 'error', text: 'Enter your email above first, then tap “Forgot password?” again.' })
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    setMessage(error ? { tone: 'error', text: error.message } : { tone: 'success', text: `Password reset link sent to ${email}. Check your inbox.` })
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lift">
          <Gift className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {mode === 'login' ? 'Welcome back' : 'Join Giftd'}
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          {mode === 'login' ? 'Sign in to see your family’s wishlists.' : 'Share wishlists with your family — and keep the surprises secret.'}
        </p>
      </div>

      <Card className="p-5 sm:p-7">
        <div role="tablist" aria-label="Sign in or create account" className="mb-6 grid grid-cols-2 rounded-xl bg-surface-muted p-1">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                'rounded-lg py-2 text-sm font-medium transition',
                mode === m ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
              )}
            >
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Field label="Your name" htmlFor="fullName" hint="This is how your family will see you.">
              <Input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Field>
          )}
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password" htmlFor="password" hint={mode === 'signup' ? 'At least 6 characters.' : undefined}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </Field>

          {message && <Alert tone={message.tone}>{message.text}</Alert>}

          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>

          {mode === 'login' && (
            <div className="text-center">
              <button type="button" onClick={handleResetPassword} className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}
